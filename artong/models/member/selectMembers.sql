SELECT
    m.*
FROM member m
{{#exists username}} 
    WHERE
        m.username = ${username}
{{/exists}}