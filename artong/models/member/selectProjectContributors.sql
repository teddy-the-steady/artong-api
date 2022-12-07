SELECT
    DISTINCT c.member_id,
    m.*,
    COUNT(c.member_id) as contributions
FROM contents c
JOIN member m ON m.id = c.member_id
WHERE 1=1
    AND c.project_address = ${project_address}
    AND c.token_id > 0
GROUP BY c.member_id, m.id
ORDER BY contributions DESC
