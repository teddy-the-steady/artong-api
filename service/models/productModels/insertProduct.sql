INSERT INTO
    t_item_info 

SELECT (SELECT CONCAT('SM', RIGHT(MAX(sm_barcode),13)+1) FROM t_item_info) AS sm_barcode
,'{{name}}' AS item_nm
,{{productAmount}} AS item_prod_amt
,null AS item_cate_nm1
,null AS item_cate_nm2
,null AS item_cate_nm3
,null AS item_barcode1
,null AS item_barcode2
,null AS item_barcode3
,null AS item_barcode4
,null AS item_barcode5
,NOW() AS ins_dt
,NOW() AS upd_dt
,'{{userId}}' AS ins_user_id
,NULL AS upd_user_id;