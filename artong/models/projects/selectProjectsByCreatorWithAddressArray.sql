SELECT
    address AS id,
{{#each _db_}}
    {{this}},
{{/each}}
    (SELECT
        COUNT(*)::int
    FROM projects
    WHERE
        member_id = (SELECT id FROM member WHERE wallet_address = ${address})
    ) AS total
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