SELECT
    m.*
FROM member m
WHERE
    {{#exists id}} m.id = ${id} {{/exists}}
    {{#exists principal_id}} m.principal_id = ${principal_id} {{/exists}}
