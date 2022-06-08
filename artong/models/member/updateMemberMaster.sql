UPDATE member_master
SET
    updated_at = now()
    {{#exists username}} ,username = ${username} {{/exists}}
WHERE id = ${id}
RETURNING id