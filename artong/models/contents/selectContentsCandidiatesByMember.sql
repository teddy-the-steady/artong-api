SELECT
  c.id,
  c.member_id,
  c.project_address,
  c.name,
  c.description,
  c.token_id,
  c.content_s3key,
  c.content_thumbnail_s3key,
  c.ipfs_url,
  c.voucher -> 'minPrice' -> 'hex' AS price,
  c.is_redeemed,
  c.status,
  c.created_at,
  c.updated_at,
  m.username,
  m.wallet_address,
  m.email,
  m.profile_s3key,
  m.profile_thumbnail_s3key,
  m.created_at AS member_created_at,
  m.updated_at AS member_updated_at
FROM
  contents c
JOIN member m ON c.member_id = m.id
WHERE 1=1
  AND c.member_id = ${member_id}
  AND c.is_redeemed = FALSE
  AND c.token_id IS NULL
  {{#if (eq isMember false)}}
  AND (c.is_redeemed IS NOT NULL AND c.status = 'APPROVED')
  {{/if}}

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