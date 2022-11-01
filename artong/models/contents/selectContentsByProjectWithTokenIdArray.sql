SELECT
  CONCAT(project_address,token_id) AS id,
{{#each _db_}}
    {{this}},
{{/each}}
  (SELECT
    COUNT(*)::int
  FROM contents
  WHERE 1=1
  AND token_id IS NOT NULL
  AND project_address = ${project_address})
  AS total
FROM
  contents
WHERE 1=1
  AND token_id IN (
    {{#each tokenIdArray}}
      '{{this}}'
      {{#unless @last}},{{/unless}}
    {{/each}}
  )
  AND project_address = ${project_address}