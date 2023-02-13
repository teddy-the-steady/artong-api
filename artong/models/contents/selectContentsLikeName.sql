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
  (CASE
    WHEN c.is_redeemed = true THEN null
    ELSE c.voucher
  END) AS voucher,
  c.is_redeemed,
  p.slug,
  c.created_at,
  c.updated_at
FROM
  contents c
JOIN projects p ON c.project_address = p.address
WHERE 1=1
  AND c.name ILIKE '%{{name}}%'
  AND (
    c.token_id > 0 OR
    (c.is_redeemed IS NOT NULL AND c.status = 'APPROVED')
  )
LIMIT 5