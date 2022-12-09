SELECT
    m.*
FROM member m
WHERE
    m.username = ${username}
