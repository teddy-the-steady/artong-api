SELECT
  id,
  member_id,
  project_address,
  name,
  description,
  token_id,
  content_s3key,
  ipfs_url,
  (CASE
    WHEN is_redeemed = true THEN null
    ELSE voucher
  END) AS voucher,
  is_redeemed
FROM
  contents
WHERE 1=1
  AND project_address = ${project_address}
  AND token_id = ${token_id}