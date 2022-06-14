SELECT
    m.*
FROM member m
WHERE
    m.auth_id = ${auth_id}
