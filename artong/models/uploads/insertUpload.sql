INSERT INTO 
  uploads(member_id, description)
VALUES(
  (SELECT id FROM member_master WHERE username = '{{username}}'),
  '{{description}}'
)
RETURNING id