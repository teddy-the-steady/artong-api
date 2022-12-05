SELECT
  *
FROM
  contents_history
WHERE 1=1
  AND contents_id = (
    SELECT id FROM contents
    WHERE project_address = ${project_address} AND token_id = ${token_id}
  )
ORDER BY block_timestamp DESC, history_type DESC
LIMIT ${count_num}
OFFSET ${start_num}