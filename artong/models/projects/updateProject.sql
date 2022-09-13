UPDATE projects
SET
    updated_at = now()
    {{#exists description}} ,description = ${description} {{/exists}}
    {{#exists thumbnail_url}} ,thumbnail_url = ${thumbnail_url} {{/exists}}
    {{#exists background_url}} ,background_url = ${background_url} {{/exists}}
    {{#exists status}} ,status = ${status} {{/exists}}
WHERE
    address = ${address}
    AND
    member_id = ${member_id}
    
RETURNING *