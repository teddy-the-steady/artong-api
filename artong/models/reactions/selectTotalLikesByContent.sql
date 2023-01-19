SELECT
	COUNT(*) AS total_likes
FROM
	(
	SELECT DISTINCT ON (member_id) * FROM content_reactions cr
	WHERE 1=1
	AND cr.content_id = ${content_id}
	AND reaction_id IN(SELECT id FROM reactions r WHERE r.code IN('LIKE', 'UNLIKE'))
	ORDER  BY member_id, updated_at DESC
	) AS sub
WHERE 1=1
AND sub.reaction_id = 1