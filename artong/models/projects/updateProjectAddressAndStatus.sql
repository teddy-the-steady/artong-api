UPDATE projects
SET
    updated_at = now()
    {{#exists address}}
        ,address = ${address}
        ,slug = ${address}
    {{/exists}}
    {{#exists status}} ,status = ${status} {{/exists}}
WHERE
    create_tx_hash = ${create_tx_hash}
RETURNING *