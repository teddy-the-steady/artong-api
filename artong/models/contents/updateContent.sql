UPDATE contents
SET
    updated_at = now()
    {{#exists ipfs_url}} ,ipfs_url = ${ipfs_url} {{/exists}}
    {{#exists token_id}} ,token_id = ${token_id} {{/exists}}
    {{#exists voucher}} ,voucher = ${voucher} {{/exists}}
    {{#exists is_redeemed}} ,is_redeemed = ${is_redeemed} {{/exists}}
    {{#exists name}} ,name = ${name} {{/exists}}
    {{#exists description}} ,description = ${description} {{/exists}}
WHERE 1=1
    AND id = ${id}
    AND member_id = ${member_id}
RETURNING id, project_address, ipfs_url