INSERT INTO
	content_reactions(reaction_id, content_id, member_id)
VALUES(
	(SELECT id FROM reactions WHERE code = UPPER(${reaction_id})),
	${content_id},
	${member_id}
) ON CONFLICT (reaction_id, content_id, member_id) DO
UPDATE SET
	reaction_id = (SELECT id FROM reactions WHERE code = UPPER(${reaction_id})),
	updated_at = now()