SELECT
{{#each _db_}}
    {{this}},
{{/each}}
    address AS id
FROM
    projects p
LEFT JOIN member m ON m.id = p.member_id
WHERE 1=1
    AND m.wallet_address = ${address}
    AND address IN (
        {{#each addressArray}}
            '{{this}}'
            {{#unless @last}},{{/unless}}
        {{/each}}
    )