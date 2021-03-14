SELECT 
    m.*,
    d.*
FROM member_master m
LEFT JOIN member_detail d ON d.member_id = m.id 
WHERE 
{{#if id}} 
    m.id = {{id}} 
{{else if auth_id}} 
    m.auth_id = '{{auth_id}}'
{{/if}}
