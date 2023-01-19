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
  c.is_redeemed,
  c.status,
  c.created_at,
  c.updated_at,
  m.username,
  m.wallet_address,
  m.email,
  m.profile_s3key,
  m.profile_thumbnail_s3key,
  m.created_at AS member_created_at,
  m.updated_at AS member_updated_at
FROM
	(SELECT * FROM (
		SELECT DISTINCT ON (content_id) * FROM content_reactions cr
		WHERE 1=1
		AND cr.member_id = ${member_id}
		AND reaction_id IN(SELECT id FROM reactions r WHERE r.code IN('LIKE', 'UNLIKE'))
		ORDER  BY content_id, updated_at DESC
  ) a
	WHERE 1=1
	AND a.reaction_id = 1) sub
JOIN contents c ON c.id = sub.content_id
JOIN member m ON c.member_id = m.id
WHERE 1=1
  AND (c.status != 'BLOCKED' OR status IS NULL)

{{#exists order_by}}
ORDER BY
{{/exists}}
{{#if (eq order_by 'updatedAt')}}
  sub.updated_at
{{/if}}
{{#if (eq order_direction 'desc')}}
  desc
{{else if (eq order_direction 'asc')}}
  asc
{{/if}}

LIMIT ${count_num}
OFFSET ${start_num}