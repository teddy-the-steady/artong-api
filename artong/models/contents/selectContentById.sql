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
  c.created_at,
  c.updated_at,
  p.project_s3key,
  p.project_thumbnail_s3key
FROM
  contents c
JOIN projects p ON p.address = c.project_address
WHERE 1=1
  AND project_address = ${project_address}
  AND id = ${id}
