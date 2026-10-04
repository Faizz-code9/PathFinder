-- ============================================================================
-- PathFinder System — Database Triggers & Audit Automation
-- ============================================================================

-- 1. Automatic Timestamp Update Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to users table
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Apply to connection_requests table
DROP TRIGGER IF EXISTS trg_conn_updated_at ON connection_requests;
CREATE TRIGGER trg_conn_updated_at
BEFORE UPDATE ON connection_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 2. Immutable Connection Status Audit Trail Trigger
CREATE OR REPLACE FUNCTION log_connection_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        INSERT INTO activity_log (user_id, action, target_id, metadata)
        VALUES (
            NEW.receiver_id,
            'CONNECTION_STATUS_' || UPPER(NEW.status),
            NEW.sender_id,
            jsonb_build_object(
                'connection_id', NEW.id,
                'sender_id', NEW.sender_id,
                'receiver_id', NEW.receiver_id,
                'old_status', OLD.status,
                'new_status', NEW.status,
                'rel_type', NEW.rel_type,
                'message', NEW.message
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_connection_audit ON connection_requests;
CREATE TRIGGER trg_connection_audit
AFTER UPDATE ON connection_requests
FOR EACH ROW
EXECUTE FUNCTION log_connection_status_change();
