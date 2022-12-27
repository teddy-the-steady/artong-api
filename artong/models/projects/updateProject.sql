UPDATE projects
SET
    updated_at = now()
    {{#exists address}} ,address = ${address} {{/exists}}
    {{#exists description}} ,description = ${description} {{/exists}}
    {{#exists project_s3key}} ,project_s3key = ${project_s3key} {{/exists}}
    {{#exists background_s3key}} ,background_s3key = ${background_s3key} {{/exists}}
    {{#exists status}} ,status = ${status} {{/exists}}
    {{#exists sns}} ,sns = ${sns} {{/exists}}
WHERE
    create_tx_hash = ${create_tx_hash}
    AND
    member_id = ${member_id}
RETURNING *