UPDATE member
SET
    updated_at = now()
    {{#exists username}} ,username = ${username} {{/exists}}
    {{#exists introduction}} ,introduction = ${introduction} {{/exists}}
    {{#exists iso_code_2}} ,country_id = (SELECT id FROM country WHERE iso_code_2 = ${iso_code_2}) {{/exists}}
    {{#exists language_code}} ,language_id = (SELECT id FROM country WHERE language_code = ${language_code}) {{/exists}}
WHERE
    id = ${id}
RETURNING *