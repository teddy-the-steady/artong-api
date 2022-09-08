INSERT INTO projects (address, member_id, name)
VALUES(${address}, ${member_id}, ${name})
RETURNING *