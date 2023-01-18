INSERT INTO
	content_reactions(reaction_id, content_id, member_id)
VALUES(
	(SELECT id FROM reactions WHERE code = UPPER(${reaction_code})),
	${content_id},
	${member_id}
)
ON CONFLICT ON CONSTRAINT content_reactions_pkey
DO UPDATE
SET
	updated_at = now()
RETURNING *