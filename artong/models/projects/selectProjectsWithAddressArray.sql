SELECT
    address AS id,
    {{#each _db_}}
        {{this}},
    {{/each}}
    (SELECT COUNT(*) FROM projects) AS total
FROM
    projects
WHERE
    address IN (
        {{#each addressArray}}
            '{{this}}'
            {{#unless @last}},{{/unless}}
        {{/each}}
    )