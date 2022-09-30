SELECT
    p.thumbnail_url,
    p.background_url,
    p.member_id,
    p.address,
    p.name,
    p.symbol,
    p.status,
    p.created_at,
    p.updated_at
FROM
    projects p
WHERE 1=1
    {{#exists member_id}}
        AND p.member_id = ${member_id}
    {{/exists}}
    {{#exists status}}
        AND p.status = ${status}
    {{/exists}}
ORDER BY p.created_at DESC
LIMIT ${count_num}
OFFSET ${start_num}