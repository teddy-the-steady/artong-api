UPDATE member
SET
    updated_at = now()
    {{#exists profile_pic}} ,profile_pic = ${profile_pic} {{/exists}}
WHERE
    id = ${id}
RETURNING *