INSERT INTO contents (
    member_id,
    project_address,
    {{#exists status}} status, {{/exists}}
    content_s3key
)
VALUES(
    ${member_id},
    ${project_address},
    {{#exists status}} ${status}, {{/exists}}
    ${content_s3key}
)
RETURNING *