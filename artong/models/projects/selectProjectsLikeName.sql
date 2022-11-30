SELECT
  *
FROM
  projects
WHERE 1=1
  AND name ILIKE '%{{name}}%'
LIMIT 5