SELECT
  n.id as notification_id,
  sender_id,
  receiver_id,
  topic,
  redirect_on_click,
  read_at,
  n.created_at,
  cp.content_id as content_id,
  cp.content_thumbnail_s3key as content_thumbnail_s3key,
  cp.content_name as content_name,
  cp.project_address as project_address,
	cp.project_name as project_name,
  sender.username as sender_username,
  sender.profile_thumbnail_s3key as sender_profile_thumbnail_s3key,
  receiver.username as receiver_username,
  receiver.profile_thumbnail_s3key as receiver_profile_thumbnail_s3key
FROM notification n 
JOIN member sender ON n.sender_id = sender.id
JOIN member receiver ON n.receiver_id = receiver.id
LEFT JOIN (
  SELECT
		c.id as content_id,
    c.name as content_name,
		c.content_thumbnail_s3key as content_thumbnail_s3key,
    p.name as project_name,
    p.address as project_address,
    p.project_thumbnail_s3key as project_thumbnail_s3key
  FROM contents c
  JOIN projects p ON c.project_address = p.address
) cp on cp.content_id = n.content_id
WHERE 1=1
  AND n.id = ${id}