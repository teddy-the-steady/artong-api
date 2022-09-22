INSERT INTO projects (create_tx_hash, member_id, name, symbol, status)
VALUES(${create_tx_hash}, ${member_id}, ${name}, ${symbol}, ${status})
RETURNING *