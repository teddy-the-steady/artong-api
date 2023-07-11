SELECT 
  connection_id,
  connector_id,
  created_at,
  domain_name,
  stage
FROM socket_connection
WHERE connector_id= ${connectorId} 