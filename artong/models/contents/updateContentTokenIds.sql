UPDATE contents AS c SET
    token_id = a.token_id,
    is_redeemed = CASE WHEN is_redeemed IS NULL THEN NULL
                  ELSE TRUE
                  END
FROM (VALUES
    {{#each contents}}
      ('{{this.tokenURI}}', {{this.tokenId}})
      {{#unless @last}},{{/unless}}
    {{/each}}
) AS a(ipfs_url, token_id) 
WHERE a.ipfs_url = c.ipfs_url;