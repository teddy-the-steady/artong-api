INSERT INTO
	content_reactions(reaction_id, content_id, member_id)
VALUES(
	(SELECT id FROM reactions WHERE code = UPPER(${reaction_id})),
	${content_id},
	${member_id}
)
RETURNING reaction_id, content_id, member_id