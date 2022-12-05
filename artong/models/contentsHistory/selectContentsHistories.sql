SELECT
  h.id,
  h.contents_id,
  h.history_type,
  h.tx_hash,
  h.block_timestamp,
  h.created_at,
  m1.id AS from_member_id,
  m1.username AS from_username,
  m1.wallet_address AS from_wallet_address,
  m1.email  AS from_email,
  m1.profile_s3key AS from_profile_s3key,
  m1.profile_thumbnail_s3key AS from_profile_thumbnail_s3key,
  m1.created_at AS from_member_created_at,
  m1.updated_at AS from_member_updated_at,
  m2.id AS to_member_id,
  m2.username AS to_username,
  m2.wallet_address AS to_wallet_address,
  m2.email AS to_email,
  m2.profile_s3key AS to_profile_s3key,
  m2.profile_thumbnail_s3key AS to_profile_thumbnail_s3key,
  m2.created_at AS to_member_created_at,
  m2.updated_at AS to_member_updated_at
FROM
  contents_history h
LEFT JOIN member m1 ON h.from_member_id = m1.id
LEFT JOIN member m2 ON h.to_member_id = m2.id
WHERE 1=1
  AND contents_id = (
    SELECT id FROM contents
    WHERE project_address = ${project_address} AND token_id = ${token_id}
  )
  AND history_type != 'LISTINGS_SOLD'
ORDER BY block_timestamp DESC, history_type DESC
LIMIT ${count_num}
OFFSET ${start_num}