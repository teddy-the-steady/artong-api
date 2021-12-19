/*+ IndexScan(uploads uploads_pkey) */
SELECT
    u.*, d.profile_pic, m.username,
    (SELECT TRUE FROM upload_actions ua
    WHERE ua.upload_id = u.id AND ua.action_id = 1
    AND ua.member_id = (SELECT id FROM member_master WHERE username = '{{username}}' LIMIT 1)) AS "like"
FROM uploads u
LEFT OUTER JOIN member_master m ON u.member_id = m.id
LEFT OUTER JOIN member_detail d ON u.member_id = d.member_id
{{#if member_id}}
    WHERE u.member_id = {{member_id}} AND
{{else if username}}
    WHERE u.member_id = (SELECT id FROM member_master WHERE username = '{{username}}' LIMIT 1) AND
{{else}}
    WHERE
{{/if}}
{{#if lastId}}
    u.id < {{lastId}} AND
{{/if}}
1 = 1
ORDER BY u.id DESC
LIMIT {{pageSize}}

-- SELECT jsonb_pretty(jsonb_agg(js_object)) result
-- FROM (
--     SELECT 
--         jsonb_build_object(
--             'id', id,
--             'member_id', member_id,
--             'status_id', status_id,
--             'privacy_bound_id', privacy_bound_id,
--             'description', description,
--             'created_at', created_at,
--             'updated_at', updated_at,
--             'contents', jsonb_agg(contents)
--         ) js_object
--     FROM (
--         SELECT 
--             u.*, 
--             jsonb_build_object(
--                 'id', c.id, 
--                 'content_url', c.content_url, 
--                 'thumbnail_url', c.thumbnail_url
--             ) contents
--         FROM uploads u
--         LEFT JOIN contents c ON c.upload_id = u.id
--         {{#if member_id}}
--             WHERE u.member_id = {{member_id}}
--         {{else if username}}
--             WHERE u.member_id = (SELECT id FROM member_master WHERE username = '{{username}}')
--         {{/if}}
--     ) a
--     GROUP BY id, member_id, status_id, privacy_bound_id, description, created_at, updated_at
-- ) a;