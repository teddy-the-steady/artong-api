INSERT INTO notification (
  category,
  sender_id,
  receiver_id,
  content,
  redirect_on_click,
)
VALUES ( 
  ${category},
  ${sender_id},
  ${receiver_id},
  ${content},
  ${redirect_on_click},
)
RETURNING *