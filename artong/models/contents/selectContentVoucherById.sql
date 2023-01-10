SELECT
  id,
  project_address,
  {{#exists member_id}}
  (CASE
    WHEN is_redeemed = true THEN null
    ELSE voucher
  END) AS voucher,
  {{/exists}}
  is_redeemed,
  created_at,
  updated_at
FROM
  contents
WHERE 1=1
  AND id = ${id}
  AND is_redeemed IS NOT NULL