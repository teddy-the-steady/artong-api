SELECT
{{#each _db_}}
    {{this}},
{{/each}}
    address as id,
    (SELECT COUNT(*) FROM subscribe s WHERE s.project_address = p.address) AS subscribers
FROM
    projects p
WHERE 1=1
    AND create_tx_hash IN (
        {{#each txHashArray}}
            '{{this}}'
            {{#unless @last}},{{/unless}}
        {{/each}}
    )