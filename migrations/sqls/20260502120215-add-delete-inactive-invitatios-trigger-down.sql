DROP TRIGGER IF EXISTS trigger_delete_zero_days ON invitations;
DROP FUNCTION IF EXISTS delete_inactive_invitations();