INSERT INTO notification ( 
    sender_id, 
    receiver_id, 
    topic
    {{#exists redirect_on_click}} ,redirect_on_click {{/exists}}
    {{#exists content_id}} ,content_id {{/exists}}
  )
VALUES ( 
    ${sender_id}, 
    ${receiver_id}, 
    ${topic} 
    {{#exists redirect_on_click}} ,${redirect_on_click} {{/exists}}
    {{#exists content_id}} ,${content_id}  {{/exists}}
  ) 
RETURNING *