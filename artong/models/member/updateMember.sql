UPDATE member
SET
    updated_at = now()
    {{#exists username}} ,username = ${username} {{/exists}}
    {{#exists introduction}} ,introduction = ${introduction} {{/exists}}
WHERE
    id = ${id}
RETURNING *