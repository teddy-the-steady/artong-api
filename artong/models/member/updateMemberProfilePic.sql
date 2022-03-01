UPDATE member_detail
SET
    updated_at = now()
    {{#exists profile_pic}} ,profile_pic = ${profile_pic} {{/exists}}
WHERE member_id = (SELECT id FROM member_master WHERE username = ${username})