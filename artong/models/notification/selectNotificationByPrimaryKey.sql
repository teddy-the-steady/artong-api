SELECT
  n.id as notification_id,
  sender_id,
  receiver_id,
  topic,
  redirect_on_click,
  read_at,
  n.created_at,
  content_id,
  c.content_thumbnail_s3key as content_thumbnail_s3key,
  c.name as content_name,
  sender.username as sender_username,
  sender.profile_thumbnail_s3key as sender_profile_thumbnail_s3key,
  receiver.username as receiver_username,
  receiver.profile_thumbnail_s3key as receiver_profile_thumbnail_s3key
FROM notification n 
JOIN member sender ON n.sender_id = sender.id
JOIN member receiver ON n.receiver_id = receiver.id
LEFT JOIN contents c ON n.content_id = c.id
WHERE 1=1
  AND n.id = ${id}