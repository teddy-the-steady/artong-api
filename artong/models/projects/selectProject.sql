SELECT
  p.*,
  (SELECT COUNT(*) FROM subscribe s WHERE s.project_address = p.address) AS subscribers,
  (SELECT MAX(token_id) FROM contents c WHERE c.project_address = p.address) AS max_token_id
FROM
  projects p
WHERE
  {{#exists create_tx_hash}} create_tx_hash = ${create_tx_hash} {{/exists}}
  {{#exists address}} address = ${address} {{/exists}}