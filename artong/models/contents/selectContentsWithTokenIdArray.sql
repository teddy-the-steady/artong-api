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
  AND project_address IN (
    {{#each projectAddressArray}}
      '{{this}}'
      {{#unless @last}},{{/unless}}
    {{/each}}
  )