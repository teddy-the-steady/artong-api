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
  c.voucher -> 'minPrice' -> 'hex' AS price,
  c.voucher -> 'royalty' AS royalty,
  c.is_redeemed,
  c.status,
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
      AND reaction_id IN (
        SELECT
          id FROM reactions r
        WHERE
          r.code IN ('LIKE', 'UNLIKE'))
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
  p.slug,
  p.project_s3key,
  p.project_thumbnail_s3key,
  m.username,
  m.wallet_address,
  m.email,
  m.profile_s3key,
  m.profile_thumbnail_s3key,
  m.created_at AS member_created_at,
  m.updated_at AS member_updated_at
FROM
  contents c
JOIN projects p ON c.project_address = p.address
JOIN member m ON c.member_id = m.id
WHERE 1=1
  AND project_address = ${project_address}
  AND c.id = ${id}
