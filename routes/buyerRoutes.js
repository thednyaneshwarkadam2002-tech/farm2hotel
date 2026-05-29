const express =
require("express");

const router =
express.Router();

const db =
require("../config/db");


// ==========================
// BUYER REGISTER
// ==========================

router.post(
"/register",

(req,res)=>{

const {

owner_name,
mobile,
business_name,
business_type,
email,
aadhaar,
password,
gst,
city,
address

} = req.body;


if(

!owner_name ||
!mobile ||
!business_name ||
!business_type ||
!email ||
!aadhaar ||
!password ||
!city ||
!address

){

return res.status(400)
.json({
message:
"All fields required ❌"
});

}


const sql =

`
INSERT INTO buyers
(
owner_name,
mobile,
business_name,
business_type,
email,
aadhaar,
password,
gst,
city,
address
)

VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;


db.query(

sql,

[
owner_name,
mobile,
business_name,
business_type,
email,
aadhaar,
password,
gst || null,
city,
address
],

(err)=>{

if(err){

console.log(err);

return res.status(500)
.json({
message:
"Registration Failed ❌"
});

}


res.status(201)
.json({
message:
"Buyer Registered Successfully ✅"
});

}

);

}
);


// ==========================
// BUYER LOGIN
// ==========================

router.post(
"/login",

(req,res)=>{

const {

mobile,
password

} = req.body;


if(
!mobile ||
!password
){

return res.status(400)
.json({
message:
"Mobile & Password Required ❌"
});

}


const sql =

`
SELECT *
FROM buyers
WHERE mobile = ?
`;


db.query(

sql,

[mobile],

(err,result)=>{

if(err){

console.log(err);

return res.status(500)
.json({
message:
"Server Error ❌"
});

}


if(result.length === 0){

return res.status(401)
.json({
message:
"Buyer Not Found ❌"
});

}


const buyer =
result[0];


if(
buyer.password !== password
){

return res.status(401)
.json({
message:
"Wrong Password ❌"
});

}


res.json({

message:
"Login Successful ✅",

buyer

});

}

);

}
);


// ==========================
// BUYER DASHBOARD
// LIVE STATS
// ==========================

router.get(
"/dashboard/:buyerId",

(req,res)=>{

const buyerId =
req.params.buyerId;

const sql =

`
SELECT

(
SELECT COUNT(*)
FROM orders
WHERE buyer_id = ?
) AS orders,

(
SELECT IFNULL(
SUM(total_amount),
0
)
FROM orders
WHERE buyer_id = ?
AND MONTH(created_at)
=
MONTH(CURRENT_DATE())
AND YEAR(created_at)
=
YEAR(CURRENT_DATE())
) AS monthlySpend,

(
SELECT COUNT(*)
FROM wishlist
WHERE buyer_id = ?
) AS wishlist,

(
SELECT COUNT(*)
FROM cart
WHERE buyer_id = ?
) AS cartItems,

(
SELECT COUNT(*)
FROM vegetables1
) AS totalVegetables,

(
SELECT COUNT(*)
FROM farmers
) AS farmers
`;


db.query(

sql,

[
buyerId,
buyerId,
buyerId,
buyerId
],

(err,result)=>{

if(err){

console.log(err);

return res.status(500)
.json({
message:
"Dashboard Error ❌"
});

}


res.json(
result[0]
);

}

);

}
);


// ==========================
// GET ALL BUYERS
// ==========================

router.get(
"/nearby",

(req,res)=>{

const sql =

`
SELECT

id,
business_name,
city,
address

FROM buyers
ORDER BY id DESC
`;


db.query(

sql,

(err,result)=>{

if(err){

console.log(err);

return res.status(500)
.json({
message:
"Database Error ❌"
});

}

res.json(result);

}

);

}
);

// ==========================
// ACTIVE ORDERS
// ==========================

router.get(
"/active-orders/:buyerId",

(req,res)=>{

const buyerId =
req.params.buyerId;

const sql =

`
SELECT

o.id,
o.quantity,
o.total_amount,
o.order_status,
o.created_at,

v.vegetable_name,
v.image,

f.farm_name

FROM orders o

LEFT JOIN vegetables1 v
ON o.vegetable_id = v.id

LEFT JOIN farmers f
ON o.farmer_id = f.id

WHERE o.buyer_id = ?

ORDER BY o.id DESC
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
"Failed ❌"

});

}

res.json(result);

}

);

}
);


module.exports =
router;