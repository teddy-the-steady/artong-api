/*+ IndexScan(uploads uploads_pkey) */
SELECT
    u.*, d.profile_pic, m.username
    ,(SELECT
	CASE WHEN action_id = 1 THEN true ELSE NULL END
    FROM upload_actions ua
    WHERE ua.upload_id = u.id 
	AND ua.member_id = ${member_id}
    ORDER BY updated_at DESC LIMIT 1) AS "like"
FROM uploads u
LEFT OUTER JOIN member_master m ON u.member_id = m.id
LEFT OUTER JOIN member_detail d ON u.member_id = d.member_id
 WHERE
    1 = 1
{{#exists username}}
    AND u.member_id = (SELECT id FROM member_master WHERE username = ${username} LIMIT 1)
{{/exists}}
{{#exists lastId}}
    AND u.id < ${lastId}
{{/exists}}
ORDER BY u.id DESC
LIMIT ${pageSize}