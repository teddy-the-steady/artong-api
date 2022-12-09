INSERT INTO subscribe(member_id, project_address)
VALUES(${member_id}, ${project_address})
RETURNING *