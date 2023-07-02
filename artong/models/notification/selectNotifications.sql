SELECT * 
FROM notification
WHERE 1=1
  AND receiver_id = ${memberId}
ORDER BY created_at DESC
{{#exists skip}} LIMIT ${take} {{/exists}} 
{{#exists take}} OFFSET ${skip} {{/exists}}