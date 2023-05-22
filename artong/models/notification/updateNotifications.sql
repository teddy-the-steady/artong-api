UPDATE notification
SET read_at = ${readAt}
WHERE id in (
  {{#each notificationIds}}
    '{{this}}'
    {{#unless @last}},{{/unless}}
  {{/each}}
  )
RETURNING *