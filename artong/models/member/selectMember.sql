SELECT
    m.*,
    (SELECT COUNT(*) FROM follow f WHERE f.followee_id = m.id) AS follower,
    (SELECT COUNT(*) FROM follow f WHERE f.follower_id = m.id) AS following
FROM member m
WHERE
    {{#exists id}} m.id = ${id} {{/exists}}
    {{#exists principal_id}} m.principal_id = ${principal_id} {{/exists}}
