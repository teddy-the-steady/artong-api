UPDATE member_detail
SET
    updated_at = now()
    {{#exists given_name}} ,given_name = ${given_name} {{/exists}}
    {{#exists family_name}} ,family_name = ${family_name} {{/exists}}
    {{#exists zip_code}} ,zip_code = ${zip_code} {{/exists}}
    {{#exists address}} ,address = ${address} {{/exists}}
    {{#exists address_detail}} ,address_detail = ${address_detail} {{/exists}}
    {{#exists birthday}} ,birthday = ${birthday} {{/exists}}
    {{#exists introduction}} ,introduction = ${introduction} {{/exists}}
    {{#exists profile_pic}} ,profile_pic = ${profile_pic} {{/exists}}
    {{#exists language_id}} ,language_id = ${language_id} {{/exists}}
    {{#exists phone_number}} ,phone_number = ${phone_number} {{/exists}}
    {{#exists country_id}} ,country_id = ${country_id} {{/exists}}
WHERE member_id = ${member_id}
RETURNING id