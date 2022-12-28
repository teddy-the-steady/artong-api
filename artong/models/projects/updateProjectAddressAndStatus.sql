UPDATE projects
SET
    updated_at = now()
    {{#exists address}} ,address = ${address} {{/exists}}
    {{#exists status}} ,status = ${status} {{/exists}}
WHERE
    create_tx_hash = ${create_tx_hash}
RETURNING *