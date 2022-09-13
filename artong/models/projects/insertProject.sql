INSERT INTO projects (create_tx_hash, member_id, name, status)
VALUES(${create_tx_hash}, ${member_id}, ${name}, ${status})
RETURNING *