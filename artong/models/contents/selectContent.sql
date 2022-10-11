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
WHERE
  id = ${id}