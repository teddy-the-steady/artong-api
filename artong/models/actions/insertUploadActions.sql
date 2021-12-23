INSERT INTO
 	upload_actions(action_id, upload_id, member_id)
VALUES(
	(SELECT id FROM actions WHERE code = UPPER('{{action_id}}')),
	{{upload_id}},
	(SELECT id FROM member_master WHERE auth_id = '{{auth_id}}')
) ON CONFLICT (action_id, upload_id, member_id) DO
UPDATE SET
	action_id = (SELECT id FROM actions WHERE code = UPPER('{{action_id}}')),
	updated_at = now()