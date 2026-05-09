DROP TRIGGER IF EXISTS order_status_trigger ON orders;
DROP FUNCTION IF EXISTS log_order_status_change();
DROP TABLE status_history;