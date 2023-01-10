UPDATE contents
SET
    updated_at = now()
    ,status = ${status}
WHERE 1=1
    AND id = ${id}
    AND member_id = ${member_id}
RETURNING *