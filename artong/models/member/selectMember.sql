SELECT
    m.*
FROM member m
WHERE
    {{#exists id}} m.id = ${id} {{/exists}}
    {{#exists wallet_address}} m.wallet_address = ${wallet_address} {{/exists}}
