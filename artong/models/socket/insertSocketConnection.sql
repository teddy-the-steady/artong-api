INSERT INTO socket_connection (
  connection_id,
  connector_id,
  created_at
  )
VALUES (
  ${connection_id},
  ${connector_id},
  ${created_at}
  )
RETURNING *