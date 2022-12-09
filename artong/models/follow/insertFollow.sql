INSERT INTO follow(followee_id, follower_id)
VALUES(${followee_id}, ${follower_id})
RETURNING *