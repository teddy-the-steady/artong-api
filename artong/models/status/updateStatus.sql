UPDATE status
SET updated_at = now()
WHERE id = {{id}} 
AND code = '{{code}}'
AND updated_at IS NULL
returning id