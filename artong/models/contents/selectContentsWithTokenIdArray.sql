SELECT
{{#each _db_}}
  c.{{this}},
{{/each}}
  CONCAT(project_address,token_id) AS id,
  p.project_s3key,
  p.project_thumbnail_s3key
FROM
  contents c
JOIN projects p ON p.address = c.project_address
WHERE 1=1
  AND CONCAT(project_address,token_id) IN (
    {{#each idArray}}
      '{{this}}'
      {{#unless @last}},{{/unless}}
    {{/each}}
  )