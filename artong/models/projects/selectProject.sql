SELECT
  p.*,
  (SELECT COUNT(*) FROM subscribe s WHERE s.project_address = p.address) AS subscribers,
  {{#exists member_id}}
    EXISTS(SELECT s.member_id FROM subscribe s WHERE s.project_address = p.address AND s.member_id = ${member_id}) AS is_subscriber,
    EXISTS(SELECT c.member_id FROM contents c WHERE c.project_address = p.address AND c.member_id = ${member_id}) AS is_contributor,
  {{/exists}}
  (SELECT MAX(token_id) FROM contents c WHERE c.project_address = p.address) AS max_token_id
FROM
  projects p
WHERE
  {{#exists create_tx_hash}} create_tx_hash = ${create_tx_hash} {{/exists}}
  {{#exists address}} address = ${address} {{/exists}}