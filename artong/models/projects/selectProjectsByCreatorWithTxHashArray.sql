SELECT
{{#each _db_}}
    {{this}},
{{/each}}
    address as id,
    (SELECT COUNT(*) FROM subscribe s WHERE s.project_address = p.address) AS subscribers
FROM
    projects p
LEFT JOIN member m ON m.id = p.member_id
WHERE 1=1
    AND m.wallet_address = ${address}
    AND create_tx_hash IN (
        {{#each txHashArray}}
            '{{this}}'
            {{#unless @last}},{{/unless}}
        {{/each}}
    )