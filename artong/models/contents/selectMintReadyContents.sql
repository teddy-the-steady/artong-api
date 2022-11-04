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
  is_redeemed,
  created_at,
  updated_at
FROM
  contents
WHERE 1=1
  AND project_address = ${project_address}
  AND is_redeemed = FALSE
ORDER BY created_at DESC
LIMIT ${count_num}
OFFSET ${start_num}