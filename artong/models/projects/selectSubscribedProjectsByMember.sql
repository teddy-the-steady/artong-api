SELECT
    p.*,
    (SELECT COUNT(*) FROM subscribe s WHERE s.project_address = p.address) AS subscribers
FROM subscribe s
LEFT JOIN projects p ON p.address = s.project_address
WHERE 1=1
    AND s.member_id = ${member_id}
ORDER BY p.created_at DESC
LIMIT ${count_num}
OFFSET ${start_num}