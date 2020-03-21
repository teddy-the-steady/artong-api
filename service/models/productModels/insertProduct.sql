INSERT INTO
    t_item_info 

SELECT (SELECT CONCAT('SM', RIGHT(MAX(sm_barcode),13)+1) FROM t_item_info) AS sm_barcode
,'{{name}}' AS item_nm
,{{productAmount}} AS item_prod_amt
,'{{cateName1}}' AS item_cate_nm1
,'{{cateName2}}' AS item_cate_nm2
,'{{cateName3}}' AS item_cate_nm3
,'{{barcode1}}' AS item_barcode1
,'{{barcode2}}' AS item_barcode2
,'{{barcode3}}' AS item_barcode3
,'{{barcode4}}' AS item_barcode4
,'{{barcode5}}' AS item_barcode5
,NOW() AS ins_dt
,NOW() AS upd_dt
,'{{userId}}' AS ins_user_id
,NULL AS upd_user_id;