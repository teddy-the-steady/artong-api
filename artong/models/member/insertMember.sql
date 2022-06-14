INSERT INTO
    member(email, username, auth_id)
VALUES(${email}, ${username}, ${auth_id})
RETURNING *