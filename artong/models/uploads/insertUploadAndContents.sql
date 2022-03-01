WITH returned_id AS (
	INSERT INTO 
  		uploads(member_id, description, thumbnail_url)
	VALUES(
  		(SELECT id FROM member_master WHERE username = ${username}),
  		${description},
  		${thumbnail_url}
	)
	RETURNING id AS upload_id
)
INSERT INTO
 	contents(content_url, upload_id)
SELECT ${content_url}, returned_id.upload_id
FROM returned_id
LEFT OUTER JOIN contents c ON c.upload_id = returned_id.upload_id;