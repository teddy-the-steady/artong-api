UPDATE status
SET updated_at = now()
WHERE id = {{id}} AND code = '{{code}}'
returning id;