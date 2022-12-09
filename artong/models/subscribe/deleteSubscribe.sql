DELETE FROM subscribe
WHERE 1=1
    AND member_id = ${member_id}
    AND project_address = ${project_address}
RETURNING *