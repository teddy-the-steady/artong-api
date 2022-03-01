SELECT
    m.id,
    m.username,
    d.display_name,
    d.introduction,
    d.profile_pic,
    c.iso_code_2 AS language
FROM member_master m
LEFT JOIN member_detail d ON d.member_id = m.id
LEFT JOIN country c ON c.id = d.language_id
WHERE
    m.username = ${username}