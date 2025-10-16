START

FUNCTION main():
    DISPLAY "Welcome to DEPS"
    CALL login()

FUNCTION login():
    PROMPT user to enter email and password
    VALIDATE credentials
    IF valid:
        RETRIEVE role
        IF role == "Judge":
            CALL judge_menu()
        ELSE IF role == "Lawyer":
            CALL lawyer_menu()
        ELSE IF role == "Registrar":
            CALL registrar_menu()
        ELSE:
            DISPLAY "Unknown role"
            TERMINATE
    ELSE:
        DISPLAY "Invalid credentials"
        REPEAT login()

FUNCTION judge_menu():
    DISPLAY menu options: Dashboard, Case Management, Evidence Repository, Hearings, Audit Logs, Settings
    LOOP:
        PROMPT for option
        IF option == "Case Management":
            CALL view_cases()
        ELSE IF option == "Evidence Repository":
            CALL view_evidence()
        ELSE IF option == "Hearings":
            CALL manage_hearings()
        ELSE IF option == "Audit Logs":
            CALL view_audit_logs()
        ELSE IF option == "Settings":
            CALL update_settings()
        ELSE IF option == "Exit":
            BREAK

FUNCTION lawyer_menu():
    DISPLAY menu options: Dashboard, Case Management, Evidence Repository, Hearings, Settings
    LOOP:
        PROMPT for option
        IF option == "Evidence Repository":
            CALL upload_evidence()
        ELSE IF option == "Case Management":
            CALL view_cases()
        ELSE:
            CONTINUE menu

FUNCTION registrar_menu():
    DISPLAY menu options: Dashboard, Case Management, Evidence Repository, Audit Logs, Settings
    LOOP:
        IF option == "Evidence Repository":
            CALL validate_evidence()
        ELSE IF option == "Audit Logs":
            CALL view_audit_logs()

FUNCTION upload_evidence():
    PROMPT user to select file
    PROMPT user to enter metadata: FileType, CaseID, Description
    COMPUTE file hash
    STORE evidence record in DB
    LOG action in audit trail
    DISPLAY "Evidence uploaded successfully"

FUNCTION validate_evidence():
    DISPLAY list of pending evidence
    PROMPT user to approve/reject
    UPDATE validation status
    LOG action in audit trail

FUNCTION view_audit_logs():
    FETCH logs based on user or evidence
    DISPLAY in chronological order

FUNCTION process_payment():
    PROMPT for CaseID, amount, payment method
    VALIDATE input
    STORE payment info
    DISPLAY "Payment successful"

END

