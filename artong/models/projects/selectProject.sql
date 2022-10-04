SELECT
  *
FROM
  projects
WHERE
  {{#exists create_tx_hash}} create_tx_hash = ${create_tx_hash} {{/exists}}
  {{#exists address}} address = ${address} {{/exists}}