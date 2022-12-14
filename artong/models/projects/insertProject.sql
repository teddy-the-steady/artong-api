INSERT INTO projects (create_tx_hash, member_id, name, symbol, status, project_s3key ,background_s3key)
VALUES(${create_tx_hash}, ${member_id}, ${name}, ${symbol}, ${status}, ${project_s3key}, ${background_s3key})
RETURNING *