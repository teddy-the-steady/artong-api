INSERT INTO socket_connection (
  connection_id,
  connector_id
  )
VALUES (
  ${connectionId},
  ${connectorId}
  )
RETURNING *