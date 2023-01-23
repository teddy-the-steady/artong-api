SELECT
    m.id AS member_id,
    m.email,
    m.username,
    m.profile_s3key,
    m.profile_thumbnail_s3key,
    m.wallet_address,
    m.created_at AS member_created_at,
    m.updated_at AS member_updated_at
FROM member m
WHERE 1=1
    AND wallet_address IN (
        {{#each walletAddressArray}}
            '{{this}}'
            {{#unless @last}},{{/unless}}
        {{/each}}
    )