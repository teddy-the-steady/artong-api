UPDATE member_master
SET
    updated_at = now()
    ,username = {{#if username}} '{{username}}' {{else if (or (eq username null) (eq username ''))}} NULL {{else}} username {{/if}}
    ,status_id = {{#if status_id}} {{status_id}} {{else if (eq status_id null)}} NULL {{else}} status_id {{/if}}
    ,is_email_verified = {{#if is_email_verified}} {{is_email_verified}} {{else if (eq is_email_verified false)}} false {{else}} is_email_verified {{/if}}
WHERE id = {{id}}