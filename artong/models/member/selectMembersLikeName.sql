SELECT
    *
FROM member
WHERE 1=1
    AND username ILIKE '%{{username}}%'
LIMIT 5