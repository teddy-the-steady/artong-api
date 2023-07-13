WITH inserted AS ( 
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
)
SELECT 
	c.member_id as member_id,
	c.id as content_id
FROM inserted i
JOIN contents c on c.id = i.content_id