const db =
require("../config/db");


// ======================
// REGISTER BUYER
// ======================

const registerBuyer =
(req,res)=>{

try{

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


const checkQuery =

`
SELECT *
FROM buyers

WHERE mobile = ?
OR email = ?
`;


db.query(

checkQuery,

[
mobile,
email
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

return res.status(400)
.json({
message:
"Buyer Already Exists ❌"
});

}


const insertQuery =

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

insertQuery,

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
err.sqlMessage
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

}

catch(error){

console.log(error);

res.status(500)
.json({
message:
"Server Error ❌"
});

}

};



// ======================
// LOGIN BUYER
// ======================

const loginBuyer =
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


const query =

`
SELECT *
FROM buyers

WHERE mobile = ?
`;


db.query(

query,

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
"Mobile Not Registered ❌"
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


res.status(200)
.json({

message:
"Login Successful ✅",

buyer:{

id:
buyer.id,

owner_name:
buyer.owner_name,

business_name:
buyer.business_name,

business_type:
buyer.business_type,

mobile:
buyer.mobile,

email:
buyer.email,

city:
buyer.city,

address:
buyer.address

}

});

}

);

};



// ======================
// BUYER DASHBOARD
// LIVE STATS
// ======================

const getBuyerDashboard =
(req,res)=>{

const buyerId =
req.params.id;


const query =

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

query,

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


res.status(200)
.json(result[0]);

}

);

};



// ======================
// GET NEARBY HOTELS
// ======================

const getNearbyHotels =
(req,res)=>{

const query =

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

query,

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

};

// ======================
// GET ACTIVE ORDERS
// ======================

const getActiveOrders =
(req,res)=>{

const buyerId =
req.params.buyerId;

const query =
`
SELECT

o.id,
o.quantity,
o.total_amount,
o.order_status,
o.created_at,

v.vegetable_name,
v.image,

f.farm_name,
f.mobile

FROM orders o

LEFT JOIN vegetables1 v
ON o.vegetable_id = v.id

LEFT JOIN farmers f
ON o.farmer_id = f.id

WHERE o.buyer_id = ?

AND o.order_status
IN (
'Pending',
'Accepted',
'Processing',
'Out for Delivery'
)

ORDER BY o.id DESC
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
"Failed ❌"

});

}

res.json(result);

}

);

};


// ======================
// EXPORT
// ======================

module.exports = {

registerBuyer,
loginBuyer,
getNearbyHotels,
getBuyerDashboard,
getActiveOrders

};