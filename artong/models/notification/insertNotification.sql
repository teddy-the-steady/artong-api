INSERT INTO
  notification ( sender_id, receiver_id, content, category, redirect_on_click, content_id)
VALUES
  ( ${sender_id}, ${receiver_id}, ${content}, ${category}, ${redirect_on_click}, ${contend_id}) 
RETURNING *