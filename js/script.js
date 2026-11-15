/* ============================================
   Project Management Form — Main Script
   ============================================
   Handles form behavior, validation, state
   management, and AJAX calls to the Netlify
   serverless function backend.
   ============================================ */

$(document).ready(function () {

    // ─── Element References ───
    const $projectId      = $("#projectId");
    const $projectName    = $("#projectName");
    const $assignedTo     = $("#assignedTo");
    const $assignmentDate = $("#assignmentDate");
    const $deadline       = $("#deadline");
    const $btnSave        = $("#btnSave");
    const $btnUpdate      = $("#btnUpdate");
    const $btnReset       = $("#btnReset");
    const $notification   = $("#notification");
    const $loading        = $("#loading-overlay");

    // ─── State ───
    let currentRecNo = null;   // record number needed for JPDB UPDATE command
    let isProcessing = false;  // prevents duplicate submissions

    // ─── API Base ───
    // Netlify Functions endpoint (works both locally via 'netlify dev' and in production)
    const API_BASE = "/.netlify/functions/jpdb";

    // ══════════════════════════════════════════════
    //  INITIALIZATION — reset form to starting state
    // ══════════════════════════════════════════════

    resetForm();

    // ══════════════════════════════════════════════
    //  EVENT HANDLERS
    // ══════════════════════════════════════════════

    /**
     * When user leaves the Project-ID field (on change),
     * check whether that ID already exists in the database.
     */
    $projectId.on("change", function () {
        var pid = $.trim($projectId.val());
        if (pid === "") {
            showNotification("Please enter a Project-ID.", "warning");
            $projectId.focus();
            return;
        }
        checkProjectId(pid);
    });

    /**
     * Trigger lookup when Enter is pressed inside Project-ID.
     */
    $projectId.on("keypress", function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $(this).trigger("change");
        }
    });

    /**
     * Prevent form submission on Enter in other fields.
     */
    $("#projectForm").on("keypress", "input:not(#projectId)", function (e) {
        if (e.which === 13) {
            e.preventDefault();
        }
    });

    /**
     * Save button — insert a new record.
     */
    $btnSave.on("click", function () {
        if (isProcessing) return;
        if (!validateForm()) return;
        saveRecord();
    });

    /**
     * Update button — modify an existing record.
     */
    $btnUpdate.on("click", function () {
        if (isProcessing) return;
        if (!validateForm()) return;
        updateRecord();
    });

    /**
     * Reset button — restore initial state.
     */
    $btnReset.on("click", function () {
        resetForm();
    });

    // ══════════════════════════════════════════════
    //  CHECK PROJECT-ID  (GET_BY_KEY via backend)
    // ══════════════════════════════════════════════

    /**
     * Checks whether a Project-ID already exists in JsonPowerDB.
     *
     * - If it exists (status 200): populate form fields for UPDATE.
     * - If it does not exist (status 404): enable form for new INSERT.
     *
     * @param {string} pid - The Project-ID value entered by the user.
     */
    function checkProjectId(pid) {
        showLoading(true);
        clearNotification();

        $.ajax({
            url: API_BASE,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                action: "GET_BY_KEY",
                dbName: "COLLEGE-DB",
                rel: "PROJECT-TABLE",
                jsonStr: { "Project-ID": pid }
            }),
            success: function (response) {
                showLoading(false);

                if (response.status === 200) {
                    // ── Record FOUND → populate form for UPDATE ──
                    var record = response.data.record;
                    currentRecNo = response.data.rec_no;

                    $projectName.val(record["Project-Name"] || "");
                    $assignedTo.val(record["Assigned-To"] || "");
                    $assignmentDate.val(record["Assignment-Date"] || "");
                    $deadline.val(record["Deadline"] || "");

                    // Disable Project-ID (cannot change primary key), enable others
                    $projectId.prop("disabled", true);
                    enableFields(true);
                    $btnSave.prop("disabled", true);
                    $btnUpdate.prop("disabled", false);

                    showNotification("Record found. You can update the details.", "success");
                    $projectName.focus();

                } else {
                    // ── Record NOT FOUND → enable form for new INSERT ──
                    enableForNew();
                }
            },
            error: function (xhr) {
                showLoading(false);
                var resp = xhr.responseJSON || {};

                if (xhr.status === 404 || resp.status === 404) {
                    // Not found is expected for new Project-IDs
                    enableForNew();
                } else {
                    showNotification(
                        "Error checking Project-ID: " +
                        (resp.message || xhr.statusText || "Network error"),
                        "error"
                    );
                }
            }
        });
    }

    /**
     * Enables the form for entering a brand-new record.
     */
    function enableForNew() {
        currentRecNo = null;
        enableFields(true);
        $btnSave.prop("disabled", false);
        $btnUpdate.prop("disabled", true);
        showNotification("New Project-ID. Fill the details and click Save.", "success");
        $projectName.focus();
    }

    // ══════════════════════════════════════════════
    //  SAVE  (PUT command via backend)
    // ══════════════════════════════════════════════

    /**
     * Inserts a new record into JsonPowerDB using the IML PUT command.
     * The Netlify function constructs the actual JPDB request payload.
     */
    function saveRecord() {
        isProcessing = true;
        showLoading(true);

        var data = {
            "Project-ID":       $.trim($projectId.val()),
            "Project-Name":     $.trim($projectName.val()),
            "Assigned-To":      $.trim($assignedTo.val()),
            "Assignment-Date":  $assignmentDate.val(),
            "Deadline":         $deadline.val()
        };

        $.ajax({
            url: API_BASE,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                action: "PUT",
                dbName: "COLLEGE-DB",
                rel: "PROJECT-TABLE",
                jsonStr: data
            }),
            success: function (response) {
                showLoading(false);
                isProcessing = false;

                if (response.status === 200) {
                    showNotification("Record saved successfully!", "success");
                    setTimeout(resetForm, 1200);
                } else {
                    showNotification(
                        "Save failed: " + (response.message || "Unknown error"),
                        "error"
                    );
                }
            },
            error: function (xhr) {
                showLoading(false);
                isProcessing = false;
                var resp = xhr.responseJSON || {};
                showNotification(
                    "Save error: " + (resp.message || xhr.statusText || "Network error"),
                    "error"
                );
            }
        });
    }

    // ══════════════════════════════════════════════
    //  UPDATE  (UPDATE command via backend, needs rec_no)
    // ══════════════════════════════════════════════

    /**
     * Updates an existing record in JsonPowerDB using the IML UPDATE command.
     * The UPDATE command requires the record number (rec_no) that was obtained
     * during the initial GET_BY_KEY lookup.
     */
    function updateRecord() {
        if (currentRecNo === null || currentRecNo === undefined) {
            showNotification(
                "Cannot update: record number is missing. Please reset and try again.",
                "error"
            );
            return;
        }

        isProcessing = true;
        showLoading(true);

        var updatedFields = {
            "Project-Name":     $.trim($projectName.val()),
            "Assigned-To":      $.trim($assignedTo.val()),
            "Assignment-Date":  $assignmentDate.val(),
            "Deadline":         $deadline.val()
        };

        $.ajax({
            url: API_BASE,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                action: "UPDATE",
                dbName: "COLLEGE-DB",
                rel: "PROJECT-TABLE",
                rec_no: currentRecNo,
                jsonStr: updatedFields
            }),
            success: function (response) {
                showLoading(false);
                isProcessing = false;

                if (response.status === 200) {
                    showNotification("Record updated successfully!", "success");
                    setTimeout(resetForm, 1200);
                } else {
                    showNotification(
                        "Update failed: " + (response.message || "Unknown error"),
                        "error"
                    );
                }
            },
            error: function (xhr) {
                showLoading(false);
                isProcessing = false;
                var resp = xhr.responseJSON || {};
                showNotification(
                    "Update error: " + (resp.message || xhr.statusText || "Network error"),
                    "error"
                );
            }
        });
    }

    // ══════════════════════════════════════════════
    //  VALIDATION
    // ══════════════════════════════════════════════

    /**
     * Validates all five form fields.
     * Checks: empty fields, valid date formats, deadline >= assignment date.
     *
     * @returns {boolean} true if all fields are valid.
     */
    function validateForm() {
        clearInputErrors();

        var pid   = $.trim($projectId.val());
        var pname = $.trim($projectName.val());
        var ato   = $.trim($assignedTo.val());
        var adate = $assignmentDate.val();
        var dline = $deadline.val();

        // 1. Check for empty fields
        if (!pid) {
            markError($projectId, "Project-ID is required.");
            return false;
        }
        if (!pname) {
            markError($projectName, "Project-Name is required.");
            return false;
        }
        if (!ato) {
            markError($assignedTo, "Assigned-To is required.");
            return false;
        }
        if (!adate) {
            markError($assignmentDate, "Assignment-Date is required.");
            return false;
        }
        if (!dline) {
            markError($deadline, "Deadline is required.");
            return false;
        }

        // 2. Validate date formats
        if (isNaN(Date.parse(adate))) {
            markError($assignmentDate, "Assignment-Date is not a valid date.");
            return false;
        }
        if (isNaN(Date.parse(dline))) {
            markError($deadline, "Deadline is not a valid date.");
            return false;
        }

        // 3. Deadline must not be earlier than Assignment-Date
        if (new Date(dline) < new Date(adate)) {
            markError($deadline, "Deadline cannot be earlier than Assignment-Date.");
            return false;
        }

        return true;
    }

    /**
     * Marks a specific field as having an error and shows a notification.
     */
    function markError($field, message) {
        $field.addClass("input-error");
        showNotification(message, "error");
        $field.focus();
    }

    /**
     * Clears all input error highlights.
     */
    function clearInputErrors() {
        $("input").removeClass("input-error");
    }

    // ══════════════════════════════════════════════
    //  FORM STATE MANAGEMENT
    // ══════════════════════════════════════════════

    /**
     * Resets the form to its initial state:
     *  - Clears all input values
     *  - Enables only Project-ID
     *  - Disables all other fields, Save, and Update
     *  - Keeps Reset available
     *  - Clears notifications
     *  - Moves cursor to Project-ID
     */
    function resetForm() {
        // Clear all values
        $projectId.val("");
        $projectName.val("");
        $assignedTo.val("");
        $assignmentDate.val("");
        $deadline.val("");

        // Reset internal state
        currentRecNo = null;
        isProcessing = false;

        // Enable only Project-ID
        $projectId.prop("disabled", false);
        enableFields(false);

        // Button states
        $btnSave.prop("disabled", true);
        $btnUpdate.prop("disabled", true);
        $btnReset.prop("disabled", false);

        // Clear all visual indicators
        clearInputErrors();
        clearNotification();
        showLoading(false);

        // Focus on Project-ID
        $projectId.focus();
    }

    /**
     * Enables or disables the four editable fields
     * (everything except Project-ID).
     *
     * @param {boolean} enable - true to enable, false to disable.
     */
    function enableFields(enable) {
        $projectName.prop("disabled", !enable);
        $assignedTo.prop("disabled", !enable);
        $assignmentDate.prop("disabled", !enable);
        $deadline.prop("disabled", !enable);
    }

    // ══════════════════════════════════════════════
    //  UI HELPERS
    // ══════════════════════════════════════════════

    /**
     * Shows a notification message with a type class.
     *
     * @param {string} message - Text to display.
     * @param {string} type    - One of: "success", "error", "warning".
     */
    function showNotification(message, type) {
        $notification
            .removeClass("success error warning")
            .addClass(type)
            .text(message)
            .slideDown(200);

        // Auto-hide success and warning messages after 5 seconds
        if (type !== "error") {
            setTimeout(function () {
                $notification.slideUp(200);
            }, 5000);
        }
    }

    /**
     * Clears and hides the notification area.
     */
    function clearNotification() {
        $notification.slideUp(100).removeClass("success error warning").text("");
    }

    /**
     * Shows or hides the full-screen loading overlay.
     *
     * @param {boolean} show - true to show, false to hide.
     */
    function showLoading(show) {
        if (show) {
            $loading.fadeIn(150);
        } else {
            $loading.fadeOut(150);
        }
    }

});
