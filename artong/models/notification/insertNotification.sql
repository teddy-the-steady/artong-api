INSERT INTO notification ( 
    sender_id, 
    receiver_id, 
    noti_message, 
    noti_type, 
    {{#exists redirect_on_click}} redirect_on_click, {{/exists}}
    content_id
  )
VALUES ( 
    ${sender_id}, 
    ${receiver_id}, 
    ${noti_message}, 
    ${noti_type}, 
    {{#exists redirect_on_click}} ${redirect_on_click}, {{/exists}}
    ${content_id} 
  ) 
RETURNING *