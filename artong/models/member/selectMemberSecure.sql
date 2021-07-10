SELECT
    m.*,
    d.*,
    c.iso_code_2 AS language
FROM member_master m
LEFT JOIN member_detail d ON d.member_id = m.id
LEFT JOIN country c ON c.id = d.language_id
WHERE
{{#if id}}
    m.id = {{id}}
{{else if auth_id}}
    m.auth_id = '{{auth_id}}'
{{/if}}

