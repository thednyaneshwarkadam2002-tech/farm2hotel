const db =
require("../config/db");


// =====================
// ADD TO CART
// =====================

const addToCart =
(req,res)=>{

const {

buyer_id,
vegetable_id,
farmer_id,
quantity,
price_per_kg,
total_amount

}

=

req.body;


// CHECK EXISTING ITEM

const checkQuery = `
SELECT *
FROM cart

WHERE buyer_id = ?
AND vegetable_id = ?
`;

db.query(

checkQuery,

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


// ALREADY EXISTS

if(
result.length > 0
){

const updateQuery = `
UPDATE cart

SET quantity =
quantity + 1,

total_amount =
(quantity + 1)
* price_per_kg

WHERE buyer_id = ?
AND vegetable_id = ?
`;

db.query(

updateQuery,

[
buyer_id,
vegetable_id
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
"Cart Updated ✅"

});

}

);

}

else{


// INSERT NEW

const insertQuery = `
INSERT INTO cart
(

buyer_id,
vegetable_id,
farmer_id,
quantity,
price_per_kg,
total_amount

)

VALUES (?, ?, ?, ?, ?, ?)
`;

db.query(

insertQuery,

[
buyer_id,
vegetable_id,
farmer_id,
quantity || 1,
price_per_kg,
total_amount
],

(err)=>{

if(err){

console.log(err);

return res.status(500)
.json({

message:
"Failed ❌"

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

};



// =====================
// GET CART
// =====================

const getCart =
(req,res)=>{

const buyerId =
req.params.buyerId;

const query = `
SELECT

cart.*,

vegetables1.vegetable_name,
vegetables1.image,
vegetables1.price,
vegetables1.category

FROM cart

LEFT JOIN vegetables1
ON cart.vegetable_id =
vegetables1.id

WHERE cart.buyer_id = ?

ORDER BY cart.id DESC
`;

db.query(

query,

[
buyerId
],

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

};



// =====================
// UPDATE QUANTITY
// =====================

const updateCartQuantity =
(req,res)=>{

const id =
req.params.id;

const {
quantity
}
=
req.body;

if(quantity < 1){

return res.status(400)
.json({

message:
"Invalid Quantity ❌"

});

}

const query = `
UPDATE cart

SET quantity = ?,
total_amount =
price_per_kg * ?

WHERE id = ?
`;

db.query(

query,

[
quantity,
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

};



// =====================
// DELETE CART ITEM
// =====================

const deleteCart =
(req,res)=>{

const id =
req.params.id;

const query = `
DELETE FROM cart
WHERE id = ?
`;

db.query(

query,

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

};



// =====================
// CLEAR CART
// =====================

const clearCart =
(req,res)=>{

const buyerId =
req.params.buyerId;

const query = `
DELETE FROM cart
WHERE buyer_id = ?
`;

db.query(

query,

[
buyerId
],

(err)=>{

if(err){

console.log(err);

return res.status(500)
.json({

message:
"Failed ❌"

});

}

res.json({

message:
"Cart Cleared ✅"

});

}

);

};



// =====================
// EXPORTS
// =====================

module.exports = {

addToCart,
getCart,
updateCartQuantity,
deleteCart,
clearCart

};