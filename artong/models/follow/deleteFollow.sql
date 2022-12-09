DELETE FROM follow
WHERE 1=1
    AND followee_id = ${followee_id}
    AND follower_id = ${follower_id}
RETURNING *