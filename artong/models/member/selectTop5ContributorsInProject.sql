SELECT
    DISTINCT c.member_id,
    m.email,
    m.username,
    m.introduction,
    m.profile_s3key,
    m.profile_thumbnail_s3key,
    m.country_id,
    m.wallet_address,
    m.principal_id,
    m.created_at,
    m.updated_at,
    COUNT(c.member_id) as contributions
FROM contents c
JOIN member m ON m.id = c.member_id
WHERE 1=1
    AND c.project_address = ${projectAddress}
    AND c.token_id > 0
GROUP BY c.member_id, m.id, c.project_address
ORDER BY contributions DESC
LIMIT 5