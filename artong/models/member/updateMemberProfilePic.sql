UPDATE member_detail
SET
    updated_at = now()
    ,profile_pic = {{#if profile_pic}} '{{profile_pic}}' {{else if (or (eq profile_pic null) (eq profile_pic ''))}} NULL {{else}} profile_pic {{/if}}
WHERE member_id = (SELECT id FROM member_master WHERE username = '{{username}}')