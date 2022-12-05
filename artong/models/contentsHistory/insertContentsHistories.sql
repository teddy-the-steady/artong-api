INSERT INTO contents_history
    (history_type, subgraph_raw, tx_hash, from_member_id, to_member_id, block_timestamp, contents_id)
VALUES
    {{#each histories}}
      (
        '{{this.history_type}}',
        '{
            {{#each this.subgraph_raw}}
                "{{@key}}":"{{this}}"
                {{#unless @last}},{{/unless}}
            {{/each}}
        }',
        '{{this.tx_hash}}',
        (SELECT id FROM member WHERE wallet_address = '{{this.from_member_id}}'),
        (SELECT id FROM member WHERE wallet_address = '{{this.to_member_id}}'),
        '{{this.block_timestamp}}',
        (SELECT id FROM contents WHERE project_address = ${project_address} AND token_id = ${token_id})
      )
      {{#unless @last}},{{/unless}}
    {{/each}}