UPDATE projects
SET
    updated_at = now()
    {{#exists project_thumbnail_s3key}} ,project_thumbnail_s3key = ${project_thumbnail_s3key} {{/exists}}
    {{#exists background_thumbnail_s3key}} ,background_thumbnail_s3key = ${background_thumbnail_s3key} {{/exists}}
WHERE
    {{#exists project_s3key}} project_s3key = ${project_s3key} {{/exists}}
    {{#exists background_s3key}} background_s3key = ${background_s3key} {{/exists}}
RETURNING *