SELECT
    address AS id,
    {{#each _db_}}
        {{this}}
        {{#unless @last}},{{/unless}}
    {{/each}}
FROM
    projects
WHERE
    address IN (
        {{#each addressArray}}
            '{{this}}'
            {{#unless @last}},{{/unless}}
        {{/each}}
    )