INSERT INTO projects (address, member_id, name, status)
VALUES(${address}, ${member_id}, ${name}, ${status})
RETURNING *