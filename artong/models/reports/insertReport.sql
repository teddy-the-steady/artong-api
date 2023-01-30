INSERT INTO
	reports(description, category, member_id)
VALUES(
	${description},
	${category},
	${member_id}
)
RETURNING *