SELECT sm_barcode AS "id"
    ,item_nm AS "name"
    ,item_prod_amt AS "productAmount"
    ,item_cate_nm1 AS "categoryName1"
    ,item_cate_nm2 AS "categoryName2"
    ,item_cate_nm2 AS "categoryName3"
FROM t_item_info

{{#if (or barcode name)}}
WHERE
    {{#if barcode}}
        (sm_barcode LIKE '%{{barcode}}%'
        OR item_barcode1 LIKE '%{{barcode}}%'
        OR item_barcode2 LIKE '%{{barcode}}%'
        OR item_barcode3 LIKE '%{{barcode}}%'
        OR item_barcode4 LIKE '%{{barcode}}%'
        OR item_barcode5 LIKE '%{{barcode}}%')
    {{/if}}

    {{#if (and barcode name)}}
        AND
    {{/if}}

    {{#if name}}
        (item_nm LIKE '%{{name}}%')
    {{/if}}
{{/if}}

ORDER BY upd_dt DESC

LIMIT 0, 10;