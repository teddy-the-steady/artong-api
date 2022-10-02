UPDATE contents
SET
    updated_at = now()
    {{#exists ipfs_url}} ,ipfs_url = ${ipfs_url} {{/exists}}
WHERE
    id = ${id}
RETURNING *