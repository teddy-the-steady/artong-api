INSERT INTO
    member(wallet_address, username, principal_id)
VALUES(${wallet_address}, ${username}, ${principal_id})
RETURNING *