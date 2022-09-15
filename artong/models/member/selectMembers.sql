SELECT
    m.*
FROM member m
WHERE 1=1
{{#exists username}} 
    AND m.username = ${username}
{{/exists}}
{{#exists principal_id}}
    AND m.principal_id = ${principal_id}
{{/exists}}
LIMIT 5