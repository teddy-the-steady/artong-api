UPDATE contents
SET
    updated_at = now()
    {{#exists content_thumbnail_s3key}} ,content_thumbnail_s3key = ${content_thumbnail_s3key} {{/exists}}
WHERE
    content_s3key = ${content_s3key}
RETURNING *