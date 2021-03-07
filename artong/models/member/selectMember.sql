SELECT 
    m.*,
    d.*
FROM member_master m
LEFT JOIN member_detail d ON d.member_id = m.id 
WHERE m.id = {{id}}