UPDATE contents
SET
    updated_at = now()
    {{#exists ipfs_url}} ,ipfs_url = ${ipfs_url} {{/exists}}
    {{#exists token_id}} ,token_id = ${token_id} {{/exists}}
    {{#exists voucher}} ,voucher = ${voucher} {{/exists}}
    {{#exists is_redeemed}} ,is_redeemed = ${is_redeemed} {{/exists}}
WHERE
    id = ${id}
RETURNING *