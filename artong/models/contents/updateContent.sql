UPDATE contents
SET
    updated_at = now()
    {{#exists ipfs_url}} ,ipfs_url = ${ipfs_url} {{/exists}}
    {{#exists token_id}} ,token_id = ${token_id} {{/exists}}
WHERE
    id = ${id}
RETURNING *