UPDATE projects
SET
    updated_at = now()
    {{#exists address}} ,address = ${address} {{/exists}}
    {{#exists description}} ,description = ${description} {{/exists}}
    {{#exists thumbnail_url}} ,thumbnail_url = ${thumbnail_url} {{/exists}}
    {{#exists background_url}} ,background_url = ${background_url} {{/exists}}
    {{#exists status}} ,status = ${status} {{/exists}}
WHERE
    create_tx_hash = ${create_tx_hash}
    AND
    member_id = ${member_id}
RETURNING *