SELECT
  c.id,
  c.member_id,
  c.project_address,
  c.name,
  c.description,
  c.token_id,
  c.content_s3key,
  c.content_thumbnail_s3key,
  c.ipfs_url,
  c.is_redeemed,
  c.created_at,
  c.updated_at,
  {{#exists member_id}}
    (SELECT
      CASE WHEN reaction_id = 1 THEN
        TRUE
      ELSE
        FALSE
      END
    FROM
      content_reactions cr
    WHERE 1=1
      AND cr.content_id = c.id
      AND member_id = ${member_id}
      AND reaction_id IN (SELECT id FROM reactions r WHERE r.code IN ('LIKE', 'UNLIKE'))
    ORDER BY
      updated_at DESC
    LIMIT 1) AS like,
  {{/exists}}
  (SELECT
			COUNT(*)
		FROM
			(
			SELECT DISTINCT ON (member_id) * FROM content_reactions cr
			WHERE 1=1
			AND cr.content_id = c.id
			AND reaction_id IN(SELECT id FROM reactions r WHERE r.code IN('LIKE', 'UNLIKE'))
			ORDER  BY member_id, updated_at DESC
			) AS sub
		WHERE 1=1
		AND sub.reaction_id = 1
	) AS total_likes,
  p.project_s3key,
  p.project_thumbnail_s3key
FROM
  contents c
JOIN projects p ON p.address = c.project_address
WHERE 1=1
  AND project_address = ${project_address}
  AND token_id = ${token_id}