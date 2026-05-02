CREATE OR REPLACE FUNCTION delete_inactive_invitations()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM invitations
    WHERE days_to_delete = 0;                
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_zero_days
AFTER INSERT OR UPDATE ON invitations
FOR EACH STATEMENT 
EXECUTE FUNCTION delete_inactive_invitations();