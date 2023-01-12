SELECT
  id,
  (SELECT wallet_address FROM member m WHERE m.id = c.member_id) AS owner,
  project_address,
  name,
  description,
  token_id,
  content_s3key,
  content_thumbnail_s3key,
  ipfs_url,
  is_redeemed,
  status,
  CASE WHEN token_id > 0 THEN NULL ELSE voucher -> 'minPrice' -> 'hex' END AS price,
  created_at,
  updated_at
FROM
  contents c
WHERE 1=1
  AND project_address = ${project_address}
  AND (
    (is_redeemed = TRUE AND token_id > 0) OR
    (is_redeemed IS NULL AND token_id > 0) OR
    {{#if (eq policy 1)}}
      (is_redeemed = FALSE AND token_id IS NULL AND status = 'APPROVED')
    {{else}}
      (is_redeemed = FALSE AND token_id IS NULL AND (status != 'BLOCKED' OR status IS NULL))
    {{/if}}
  )

{{#exists order_by}}
ORDER BY
{{/exists}}
{{#if (eq order_by 'createdAt')}}
  c.created_at
{{/if}}
{{#if (eq order_direction 'desc')}}
  desc
{{else if (eq order_direction 'asc')}}
  asc
{{/if}}

LIMIT ${count_num}
OFFSET ${start_num}