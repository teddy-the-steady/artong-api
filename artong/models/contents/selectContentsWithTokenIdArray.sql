SELECT
  id,
{{#each _db_}}
    {{this}},
{{/each}}
  (SELECT
    COUNT(*)::int
  FROM contents
  WHERE token_id IS NOT NULL)
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
  AND project_address IN (
    {{#each projectAddressArray}}
      '{{this}}'
      {{#unless @last}},{{/unless}}
    {{/each}}
  )