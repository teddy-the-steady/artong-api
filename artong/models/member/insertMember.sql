INSERT INTO
    member(wallet_address, username, auth_id)
VALUES(${wallet_address}, ${username}, ${auth_id})
RETURNING *