INSERT INTO
 	upload_actions(action_id, upload_id, member_id)
VALUES(
	(SELECT id FROM actions WHERE code = UPPER('{{action_id}}')),
	{{upload_id}},
	(SELECT id FROM member_master WHERE username = '{{member_id}}')
)