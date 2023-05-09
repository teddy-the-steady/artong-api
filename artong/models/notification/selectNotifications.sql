SELECT * 
FROM notification
WHERE 1=1
  AND receiver_id = ${connectorId}