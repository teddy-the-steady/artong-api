SELECT
  p.*,
  (SELECT COUNT(*) FROM subscribe s WHERE s.project_address = p.address) AS subscribers
FROM
  projects p
WHERE
  {{#exists create_tx_hash}} create_tx_hash = ${create_tx_hash} {{/exists}}
  {{#exists address}} address = ${address} {{/exists}}