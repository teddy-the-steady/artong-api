SELECT
{{#each _db_}}
  {{this}},
{{/each}}
  CONCAT(project_address,token_id) AS id
FROM
  contents
WHERE 1=1
  AND token_id IN (
    {{#each tokenIdArray}}
      '{{this}}'
      {{#unless @last}},{{/unless}}
    {{/each}}
  )
  AND member_id = (
    SELECT id FROM member WHERE wallet_address = ${creator}
  )
