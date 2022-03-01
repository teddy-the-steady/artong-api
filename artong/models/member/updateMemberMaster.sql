UPDATE member_master
SET
    updated_at = now()
    {{#exists username}} ,username = ${username} {{/exists}}
    {{#exists status_id}} ,status_id = ${status_id} {{/exists}}
WHERE id = ${id}
RETURNING id