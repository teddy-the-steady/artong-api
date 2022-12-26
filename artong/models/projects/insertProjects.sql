INSERT INTO projects (
    create_tx_hash,
    member_id,
    address,
    name,
    symbol,
    status,
    created_at
)
VALUES 
{{#each projects}}
    (
        '{{this.txHash}}',
        (SELECT COALESCE(MAX(id), 0) FROM member WHERE wallet_address = '{{this.creator}}'),
        '{{this.id}}',
        '{{this.name}}',
        '{{this.symbol}}',
        'CREATED',
        to_timestamp('{{this.createdAt}}')
    )
    {{#unless @last}},{{/unless}}
{{/each}}
RETURNING *