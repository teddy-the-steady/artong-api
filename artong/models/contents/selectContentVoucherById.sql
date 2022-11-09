SELECT
  id,
  member_id,
  project_address,
  name,
  description,
  token_id,
  content_s3key,
  content_thumbnail_s3key,
  ipfs_url,
  (CASE
    WHEN is_redeemed = true THEN null
    ELSE voucher
  END) AS voucher,
  is_redeemed,
  created_at,
  updated_at
FROM
  contents
WHERE 1=1
  AND id = ${id}
  AND is_redeemed IS NOT NULL