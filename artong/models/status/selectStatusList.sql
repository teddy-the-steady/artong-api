SELECT 
    id,
    code,
    description,
    created_at
FROM status
WHERE updated_at IS NULL