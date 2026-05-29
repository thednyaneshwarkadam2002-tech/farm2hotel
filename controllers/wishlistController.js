const db =
require("../config/db");


// ======================
// ADD TO WISHLIST
// ======================

exports.addToWishlist =
(req,res)=>{

const {

buyer_id,
vegetable_id

} = req.body;


// CHECK ALREADY EXISTS

const checkQuery =
`
SELECT * FROM wishlist
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
"Database Error"

});

}


if(
result.length > 0
){

return res.json({

message:
"Already In Wishlist ❤️"

});

}


// INSERT

const insertQuery =
`
INSERT INTO wishlist
(
buyer_id,
vegetable_id
)

VALUES (?,?)
`;

db.query(

insertQuery,

[
buyer_id,
vegetable_id
],

(err,data)=>{

if(err){

console.log(err);

return res.status(500)
.json({

message:
"Wishlist Add Failed"

});

}


res.json({

message:
"Added To Wishlist ❤️"

});

}

);

}

);

};



// ======================
// GET WISHLIST
// ======================

exports.getWishlist =
(req,res)=>{

const buyerId =
req.params.buyerId;


const query =
`
SELECT

wishlist.id
AS wishlist_id,

wishlist.buyer_id,

vegetables.id
AS vegetable_id,

vegetables.vegetable_name,

vegetables.category,

vegetables.price,

vegetables.quantity,

vegetables.image,

vegetables.farmer_id

FROM wishlist

JOIN vegetables

ON wishlist.vegetable_id =
vegetables.id

WHERE wishlist.buyer_id = ?
`;


db.query(

query,

[buyerId],

(err,result)=>{

if(err){

console.log(err);

return res.status(500)
.json({

message:
"Database Error"

});

}


res.json(result);

}

);

};



// ======================
// REMOVE WISHLIST
// ======================

exports.removeWishlist =
(req,res)=>{

const wishlistId =
req.params.id;


const query =
`
DELETE FROM wishlist
WHERE id = ?
`;


db.query(

query,

[wishlistId],

(err,data)=>{

if(err){

console.log(err);

return res.status(500)
.json({

message:
"Delete Failed"

});

}


res.json({

message:
"Removed From Wishlist ❌"

});

}

);

};