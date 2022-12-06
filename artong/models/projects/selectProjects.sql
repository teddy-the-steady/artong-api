SELECT
    p.create_tx_hash,
    p.project_s3key,
    p.project_thumbnail_s3key,
    p.background_s3key,
    p.background_thumbnail_s3key,
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