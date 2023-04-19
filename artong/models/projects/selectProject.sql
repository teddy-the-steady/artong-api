SELECT
  p.*,
  (SELECT COUNT(*) FROM subscribe s WHERE s.project_address = p.address) AS subscribers,
  {{#exists member_id}}
    EXISTS(SELECT s.member_id FROM subscribe s WHERE s.project_address = p.address AND s.member_id = ${member_id}) AS is_subscriber,
    EXISTS(SELECT c.member_id FROM contents c WHERE c.project_address = p.address AND c.member_id = ${member_id}) AS is_contributor,
  {{/exists}}
  (SELECT MAX(token_id) FROM contents c WHERE c.project_address = p.address) AS max_token_id,
  (SELECT COUNT(*) FROM contents c
    WHERE c.project_address = p.address
    AND (c.token_id > 0 OR (c.is_redeemed IS NOT NULL AND c.status = 'APPROVED'))
  ) AS token_count,
  (SELECT COUNT(*) FROM contents c
    WHERE c.project_address = p.address
    AND c.is_redeemed = FALSE
    AND (c.status != 'APPROVED' OR c.status IS NULL)
    AND c.token_id IS NULL
  ) AS tokens_tobe_approved_count
FROM
  projects p
WHERE
  {{#exists create_tx_hash}} create_tx_hash = ${create_tx_hash} {{/exists}}
  {{#exists addressOrSlug}} address = ${addressOrSlug} OR slug = ${addressOrSlug} {{/exists}}