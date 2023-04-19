SELECT
  id,
  (SELECT wallet_address FROM member m WHERE m.id = c.member_id) AS owner,
  project_address,
  (SELECT slug FROM projects p WHERE p.address = ${project_address}),
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
  updated_at,
  COUNT(*) OVER() AS total
FROM
  contents c
WHERE 1=1
  AND project_address = ${project_address}
  AND (
    c.token_id > 0 OR
    (c.is_redeemed IS NOT NULL AND c.status = 'APPROVED')
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