INSERT INTO projects (
    create_tx_hash,
    member_id,
    name,
    symbol,
    {{#exists project_s3key}} project_s3key, {{/exists}}
    {{#exists background_s3key}} background_s3key, {{/exists}}
    status
)
VALUES (
    ${create_tx_hash},
    ${member_id},
    ${name},
    ${symbol},
    {{#exists project_s3key}} ${project_s3key}, {{/exists}}
    {{#exists background_s3key}} ${background_s3key}, {{/exists}}
    ${status}
)
RETURNING *