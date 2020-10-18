SELECT sm_barcode AS "id"
    ,item_nm AS "name"
    ,item_prod_amt AS "productAmount"
    ,item_barcode1 AS "bardcode1"
    ,item_barcode2 AS "bardcode2"
    ,item_barcode3 AS "bardcode3"				
    ,item_cate_nm1 AS "categoryName1"
    ,item_cate_nm2 AS "categoryName2"
    ,item_cate_nm2 AS "categoryName3"
from t_item_info 

WHERE sm_barcode = '{{barcode}}';