INSERT INTO socket_connection (
  connection_id,
  connector_id,
  domain_name,
  stage
  )
VALUES (
  ${connectionId},
  ${connectorId},
  ${domainName},
  ${stage}
  )
RETURNING *