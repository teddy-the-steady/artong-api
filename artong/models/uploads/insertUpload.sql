INSERT INTO 
  uploads(member_id, description, thumbnail_url)
VALUES(
  (SELECT id FROM member_master WHERE username = '{{username}}'),
  '{{description}}',
  '{{thumbnail_url}}'
)
RETURNING id