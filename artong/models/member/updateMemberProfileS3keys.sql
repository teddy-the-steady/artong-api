UPDATE member
SET
    updated_at = now()
    {{#exists profile_s3key}} ,profile_s3key = ${profile_s3key} {{/exists}}
    {{#exists profile_thumbnail_s3key}} ,profile_thumbnail_s3key = ${profile_thumbnail_s3key} {{/exists}}
WHERE
    id = ${id}
RETURNING *