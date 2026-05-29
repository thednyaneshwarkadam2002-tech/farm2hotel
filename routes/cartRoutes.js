const express =
require("express");

const router =
express.Router();

const db =
require("../config/db");


// ======================
// ADD TO CART
// ======================

router.post(
"/add",

(req,res)=>{

const {

buyer_id,
vegetable_id,
quantity

} = req.body;

if(
!buyer_id ||
!vegetable_id
){

return res.status(400)
.json({
message:
"Missing Data ❌"
});

}

const getVegetable = `
SELECT *
FROM vegetables1
WHERE id = ?
`;

db.query(

getVegetable,

[vegetable_id],

(err,vegResult)=>{

if(err){

console.log(err);

return res.status(500)
.json({
message:
"Database Error ❌"
});

}

if(
vegResult.length === 0
){

return res.status(404)
.json({
message:
"Vegetable Not Found ❌"
});

}

const vegetable =
vegResult[0];

const checkSql = `
SELECT *
FROM cart
WHERE buyer_id = ?
AND vegetable_id = ?
`;

db.query(

checkSql,

[
buyer_id,
vegetable_id
],

(err,result)=>{

if(err){

console.log(err);

return res.status(500)
.json({
message:
"Database Error ❌"
});

}

if(result.length > 0){

const updateSql = `
UPDATE cart
SET quantity =
quantity + ?
WHERE buyer_id = ?
AND vegetable_id = ?
`;

db.query(

updateSql,

[
quantity || 1,
buyer_id,
vegetable_id
],

(err)=>{

if(err){

return res.status(500)
.json({
message:
"Update Failed ❌"
});

}

res.json({
message:
"Cart Updated ✅"
});

}

);

}
else{

const insertSql = `
INSERT INTO cart
(

buyer_id,
vegetable_id,
farmer_id,
quantity,
price,
total_price

)

VALUES (?, ?, ?, ?, ?, ?)
`;

const qty =
quantity || 1;

const total =
qty *
vegetable.price;

db.query(

insertSql,

[
buyer_id,
vegetable_id,
vegetable.farmer_id,
qty,
vegetable.price,
total
],

(err)=>{

if(err){

console.log(err);

return res.status(500)
.json({
message:
"Add Failed ❌"
});

}

res.json({
message:
"Added To Cart ✅"
});

}

);

}

}

);

}

);

}
);


// ======================
// GET CART
// ======================

router.get(
"/:buyerId",

(req,res)=>{

const buyerId =
req.params.buyerId;

const sql = `
SELECT

cart.id,
cart.quantity,
cart.farmer_id,

vegetables1.id
AS vegetable_id,

vegetables1.vegetable_name,

vegetables1.price
AS price_per_kg,

vegetables1.image,

vegetables1.category,

farmers.full_name
AS farmer_name

FROM cart

LEFT JOIN vegetables1
ON cart.vegetable_id =
vegetables1.id

LEFT JOIN farmers
ON cart.farmer_id =
farmers.id

WHERE cart.buyer_id = ?

ORDER BY cart.id DESC
`;

db.query(

sql,

[buyerId],

(err,result)=>{

if(err){

console.log(err);

return res.status(500)
.json({
message:
"Cart Load Failed ❌"
});

}

res.json(result);

}

);

}
);


// ======================
// UPDATE QUANTITY
// ======================

router.put(
"/update/:id",

(req,res)=>{

const id =
req.params.id;

const {
quantity
} =
req.body;

const sql = `
UPDATE cart
SET quantity = ?
WHERE id = ?
`;

db.query(

sql,

[
quantity,
id
],

(err)=>{

if(err){

console.log(err);

return res.status(500)
.json({
message:
"Update Failed ❌"
});

}

res.json({
message:
"Quantity Updated ✅"
});

}

);

}
);


// ======================
// DELETE ITEM
// ======================

router.delete(
"/delete/:id",

(req,res)=>{

const id =
req.params.id;

const sql =
"DELETE FROM cart WHERE id = ?";

db.query(

sql,

[id],

(err)=>{

if(err){

console.log(err);

return res.status(500)
.json({
message:
"Delete Failed ❌"
});

}

res.json({
message:
"Item Removed ✅"
});

}

);

}
);


// ======================
// CLEAR CART
// ======================

router.delete(
"/clear/:buyerId",

(req,res)=>{

const buyerId =
req.params.buyerId;

const sql =
"DELETE FROM cart WHERE buyer_id = ?";

db.query(

sql,

[buyerId],

(err)=>{

if(err){

return res.status(500)
.json({
message:
"Clear Failed ❌"
});

}

res.json({
message:
"Cart Cleared ✅"
});

}

);

}
);

module.exports =
router;