SELECT
{{#each _db_}}
    {{this}},
{{/each}}
    address as id,
    (SELECT COUNT(*) FROM subscribe s WHERE s.project_address = p.address) AS subscribers
FROM
    projects p
WHERE
    address IN (
        {{#each addressArray}}
            '{{this}}'
            {{#unless @last}},{{/unless}}
        {{/each}}
    )