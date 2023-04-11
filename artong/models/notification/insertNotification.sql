INSERT INTO
  notification ( sender_id, receiver_id, content, category, redirect_on_click)
VALUES
  ( ${sender_id}, ${receiver_id}, ${content}, ${category}, ${redirect_on_click}) 
RETURNING *