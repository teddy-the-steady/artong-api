SELECT
    m.*,
    {{#exists member_id}}
        EXISTS(SELECT f.follower_id FROM follow f WHERE f.followee_id = m.id AND f.follower_id = ${member_id}) AS is_follower,
    {{/exists}}
    (SELECT COUNT(*) FROM follow f WHERE f.followee_id = m.id) AS follower,
    (SELECT COUNT(*) FROM follow f WHERE f.follower_id = m.id) AS following
FROM member m
WHERE
    m.username = ${username}
