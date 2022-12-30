SELECT
    m.*,
    EXISTS(SELECT f.follower_id FROM follow f WHERE f.followee_id = m.id AND f.follower_id = ${follower_member_id}) AS is_follower,
    (SELECT COUNT(*) FROM follow f WHERE f.followee_id = m.id) AS follower,
    (SELECT COUNT(*) FROM follow f WHERE f.follower_id = m.id) AS following
FROM member m
WHERE
    m.id = ${member_id}
