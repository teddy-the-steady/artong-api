SELECT
{{#each _db_}}
  {{this}},
{{/each}}
  CONCAT(project_address,token_id) AS id
FROM
  contents
WHERE 1=1
  AND CONCAT(project_address,token_id) IN (
    {{#each idArray}}
      '{{this}}'
      {{#unless @last}},{{/unless}}
    {{/each}}
  )