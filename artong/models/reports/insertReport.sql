INSERT INTO
	reports(
		{{#exists description}} description, {{/exists}}
		{{#exists project_address}} project_address, {{/exists}}
		{{#exists contents_id}} contents_id, {{/exists}}
		{{#exists member_id_reported}} member_id_reported, {{/exists}}
		category,
		member_id
	)
VALUES(
	{{#exists description}} ${description}, {{/exists}}
	{{#exists project_address}} ${project_address}, {{/exists}}
	{{#exists contents_id}} ${contents_id}, {{/exists}}
	{{#exists member_id_reported}} ${member_id_reported}, {{/exists}}
	${category},
	${member_id}
)
RETURNING *