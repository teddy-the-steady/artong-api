SELECT
{{#each _db_}}
    {{this}},
{{/each}}
    address AS id
FROM
    projects
WHERE
    address IN (
        {{#each addressArray}}
            '{{this}}'
            {{#unless @last}},{{/unless}}
        {{/each}}
    )