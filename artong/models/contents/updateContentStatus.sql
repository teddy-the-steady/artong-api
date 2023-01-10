UPDATE contents
SET
    updated_at = now()
    ,status = ${status}
WHERE 1=1
    AND id = ${id}
    AND project_address = (SELECT address FROM projects WHERE member_id = ${member_id} AND address = ${project_address})
RETURNING *