UPDATE member_detail
SET
    updated_at = now()
    ,given_name = {{#if given_name}} '{{given_name}}' {{else if (or (eq given_name null) (eq given_name ''))}} NULL {{else}} given_name {{/if}}
    ,family_name = {{#if family_name}} '{{family_name}}' {{else if (or (eq family_name null) (eq family_name ''))}} NULL {{else}} family_name {{/if}}
    ,zip_code = {{#if zip_code}} '{{zip_code}}' {{else if (or (eq zip_code null) (eq zip_code ''))}} NULL {{else}} zip_code {{/if}}
    ,address = {{#if address}} '{{address}}' {{else if (or (eq address null) (eq address ''))}} NULL {{else}} address {{/if}}
    ,address_detail = {{#if address_detail}} '{{address_detail}}' {{else if (or (eq address_detail null) (eq address_detail ''))}} NULL {{else}} address_detail {{/if}}
    ,birthday = {{#if birthday}} '{{birthday}}' {{else if (or (eq birthday null) (eq birthday ''))}} NULL {{else}} birthday {{/if}}
    ,introduction = {{#if introduction}} '{{introduction}}' {{else if (or (eq introduction null) (eq introduction ''))}} NULL {{else}} introduction {{/if}}
    ,profile_pic = {{#if profile_pic}} '{{profile_pic}}' {{else if (or (eq profile_pic null) (eq profile_pic ''))}} NULL {{else}} profile_pic {{/if}}
    ,language_id = {{#if language_id}} {{language_id}} {{else if (eq language_id null)}} NULL {{else}} language_id {{/if}}
    ,phone_number = {{#if phone_number}} '{{phone_number}}' {{else if (or (eq phone_number null) (eq phone_number ''))}} NULL {{else}} phone_number {{/if}}
    ,country_id = {{#if country_id}} {{country_id}} {{else if (eq country_id null)}} NULL {{else}} country_id {{/if}}
WHERE member_id = {{member_id}} AND {{member_id}} = (SELECT id FROM member_master WHERE auth_id = '{{auth_id}}')
RETURNING id