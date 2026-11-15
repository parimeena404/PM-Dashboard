/* ============================================
   Netlify Serverless Function: jpdb.mjs
   ============================================
   Acts as a secure proxy between the frontend
   and JsonPowerDB. The JPDB connection token
   is stored server-side as the environment
   variable JPDB_TOKEN and is NEVER exposed to
   the browser.
   ============================================ */

import https from 'node:https';

/**
 * JsonPowerDB API configuration.
 *
 * Host: api.login2explore.com:5577
 * All JPDB commands use HTTPS POST with a JSON body.
 *
 * IRL endpoint (retrieval) : /api/irl
 * IML endpoint (mutation)  : /api/iml
 */
const JPDB_HOST = "api.login2explore.com";
const JPDB_PORT = 5577;

/**
 * Netlify Functions handler.
 *
 * Receives POST requests from the frontend, reads the
 * JPDB_TOKEN from the server environment, constructs the
 * correct JPDB API payload, and returns the result.
 */
export async function handler(event) {

    // ── Only allow POST requests ──
    if (event.httpMethod === "OPTIONS") {
        return respond(200, {});
    }
    if (event.httpMethod !== "POST") {
        return respond(405, { status: 405, message: "Method Not Allowed" });
    }

    // ── Read the connection token from the environment ──
    const token = process.env.JPDB_TOKEN;
    if (!token) {
        return respond(500, {
            status: 500,
            message: "Server configuration error: JPDB_TOKEN environment variable is not set."
        });
    }

    // ── Parse the request body sent by the frontend ──
    let body;
    try {
        body = JSON.parse(event.body);
    } catch (err) {
        return respond(400, { status: 400, message: "Invalid JSON in request body." });
    }

    const { action, dbName, rel, jsonStr, rec_no } = body;

    if (!action) {
        return respond(400, { status: 400, message: "Missing 'action' field in request." });
    }

    try {
        // ── Route to the correct JPDB command ──
        switch (action) {
            case "GET_BY_KEY":
                return await handleGetByKey(token, dbName, rel, jsonStr);

            case "PUT":
                return await handlePut(token, dbName, rel, jsonStr);

            case "UPDATE":
                return await handleUpdate(token, dbName, rel, rec_no, jsonStr);

            default:
                return respond(400, {
                    status: 400,
                    message: "Unknown action: " + action
                });
        }
    } catch (err) {
        console.error("JPDB function error:", err);
        return respond(500, {
            status: 500,
            message: "Internal server error: " + (err.message || "Unknown")
        });
    }
}

// ══════════════════════════════════════════════
//  GET_BY_KEY — Retrieve a record by primary key
// ══════════════════════════════════════════════
//
//  JPDB IRL API:
//    POST  http://api.login2explore.com:5577/api/irl
//    {
//      "token": "<connection-token>",
//      "cmd":   "GET_BY_KEY",
//      "dbName": "<database-name>",
//      "rel":    "<relation-name>",
//      "jsonStr": { "<IndexedColumn>": "<value>" }
//    }
//
//  Success (200): { "status":200, "data":"{\"record\":{...},\"rec_no\":N}" }
//  Not found:     { "status":400, "message":"No matching record..." }
// ══════════════════════════════════════════════

async function handleGetByKey(token, dbName, rel, jsonStr) {
    const payload = {
        token:    token,
        cmd:      "GET_BY_KEY",
        dbName:   dbName || "COLLEGE-DB",
        rel:      rel    || "PROJECT-TABLE",
        jsonStr:  jsonStr
    };

    const jpdbResp = await callJPDB("/api/irl", payload);

    if (jpdbResp.status === 200) {
        // Parse the data field (JPDB returns it as a JSON string)
        let data;
        try {
            data = typeof jpdbResp.data === "string"
                ? JSON.parse(jpdbResp.data)
                : jpdbResp.data;
        } catch (_) {
            data = jpdbResp.data;
        }

        return respond(200, {
            status: 200,
            message: jpdbResp.message || "Record found.",
            data: data
        });
    } else {
        // Record not found or other JPDB error
        return respond(404, {
            status: 404,
            message: jpdbResp.message || "Record not found."
        });
    }
}

// ══════════════════════════════════════════════
//  PUT — Insert a new record
// ══════════════════════════════════════════════
//
//  JPDB IML API:
//    POST  http://api.login2explore.com:5577/api/iml
//    {
//      "token":   "<connection-token>",
//      "cmd":     "PUT",
//      "dbName":  "<database-name>",
//      "rel":     "<relation-name>",
//      "jsonStr": { "<col>":"<val>", ... }
//    }
//
//  Success (200): { "status":200, "message":"DATA INSERTED..." }
// ══════════════════════════════════════════════

async function handlePut(token, dbName, rel, jsonStr) {
    const payload = {
        token:    token,
        cmd:      "PUT",
        dbName:   dbName || "COLLEGE-DB",
        rel:      rel    || "PROJECT-TABLE",
        jsonStr:  jsonStr
    };

    const jpdbResp = await callJPDB("/api/iml", payload);

    if (jpdbResp.status === 200) {
        return respond(200, {
            status:  200,
            message: jpdbResp.message || "Record saved successfully."
        });
    } else {
        return respond(jpdbResp.status || 500, {
            status:  jpdbResp.status || 500,
            message: jpdbResp.message || "Failed to save record."
        });
    }
}

// ══════════════════════════════════════════════
//  UPDATE — Modify an existing record
// ══════════════════════════════════════════════
//
//  JPDB IML API:
//    POST  http://api.login2explore.com:5577/api/iml
//    {
//      "token":   "<connection-token>",
//      "cmd":     "UPDATE",
//      "dbName":  "<database-name>",
//      "rel":     "<relation-name>",
//      "jsonStr": {
//          "<rec_no>": { "<col>":"<new_val>", ... }
//      }
//    }
//
//  The UPDATE command requires the record number (rec_no)
//  that was returned by the earlier GET_BY_KEY lookup.
// ══════════════════════════════════════════════

async function handleUpdate(token, dbName, rel, recNo, jsonStr) {
    if (recNo === null || recNo === undefined) {
        return respond(400, {
            status:  400,
            message: "Missing record number (rec_no) for update."
        });
    }

    // JPDB UPDATE format: the jsonStr key is the record number
    const updateJsonStr = {};
    updateJsonStr[String(recNo)] = jsonStr;

    const payload = {
        token:    token,
        cmd:      "UPDATE",
        dbName:   dbName || "COLLEGE-DB",
        rel:      rel    || "PROJECT-TABLE",
        jsonStr:  updateJsonStr
    };

    const jpdbResp = await callJPDB("/api/iml", payload);

    if (jpdbResp.status === 200) {
        return respond(200, {
            status:  200,
            message: jpdbResp.message || "Record updated successfully."
        });
    } else {
        return respond(jpdbResp.status || 500, {
            status:  jpdbResp.status || 500,
            message: jpdbResp.message || "Failed to update record."
        });
    }
}

// ══════════════════════════════════════════════
//  HELPER: Call JsonPowerDB
// ══════════════════════════════════════════════

/**
 * Makes a POST request to the specified JPDB endpoint.
 *
 * @param {string} endpoint - e.g. "/api/irl" or "/api/iml"
 * @param {object} payload  - The complete JPDB request body
 * @returns {object} Parsed JSON response from JPDB
 */
async function callJPDB(endpoint, payload) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(payload);
        const options = {
            hostname: JPDB_HOST,
            port: JPDB_PORT,
            path: endpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            },
            rejectUnauthorized: false
        };

        const req = https.request(options, (res) => {
            let resBody = '';
            res.on('data', chunk => resBody += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(resBody));
                } catch {
                    resolve({ status: res.statusCode, message: resBody });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.write(data);
        req.end();
    });
}

// ══════════════════════════════════════════════
//  HELPER: Standard Response Builder
// ══════════════════════════════════════════════

/**
 * Constructs a Netlify Functions response object with
 * CORS headers for frontend compatibility.
 */
function respond(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            "Content-Type":                 "application/json",
            "Access-Control-Allow-Origin":  "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify(body)
    };
}
