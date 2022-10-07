INSERT INTO contents (member_id, project_address, content_s3key)
VALUES(${member_id}, ${project_address}, ${content_s3key})
RETURNING *