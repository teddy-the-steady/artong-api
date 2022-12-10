SELECT
    m.*,
    (SELECT COUNT(*) FROM follow f WHERE f.followee_id = m.id) AS follower,
    (SELECT COUNT(*) FROM follow f WHERE f.follower_id = m.id) AS following
FROM member m
WHERE
    m.username = ${username}
