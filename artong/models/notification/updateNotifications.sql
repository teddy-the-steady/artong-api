UPDATE notification
SET read_at = ${readAt}, updated_at = ${updatedAt}
WHERE id in (
  {{#each notificationIds}}
    '{{this}}'
    {{#unless @last}},{{/unless}}
  {{/each}}
  )
RETURNING *