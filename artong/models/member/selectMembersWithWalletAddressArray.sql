SELECT
    m.*
FROM member m
WHERE 1=1
    AND wallet_address IN (
        {{#each walletAddressArray}}
            '{{this}}'
            {{#unless @last}},{{/unless}}
        {{/each}}
    )