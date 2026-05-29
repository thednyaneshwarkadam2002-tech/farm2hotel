const db =
require("../config/db");


// ======================
// PLACE ORDER
// ======================

const placeOrder =
(req,res)=>{

const {

buyer_id,
farmer_id,
vegetable_id,

buyer_name,
business_name,

farmer_name,
vegetable_name,

quantity,
delivery_address,

buyer_latitude,
buyer_longitude

} = req.body;


// VALIDATION

if(

!buyer_id ||
!farmer_id ||
!vegetable_id ||
!quantity ||
!delivery_address

){

return res.status(400)
.json({

message:
"All fields required ❌"

});

}


// GET VEGETABLE

const vegetableQuery = `
SELECT *
FROM vegetables1
WHERE id = ?
`;

db.query(

vegetableQuery,

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
"Vegetable not found ❌"

});

}


const vegetable =
vegResult[0];


// STOCK CHECK

if(
Number(quantity)
>
Number(vegetable.quantity)
){

return res.status(400)
.json({

message:
`Only ${vegetable.quantity} KG Available ❌`

});

}


// TOTAL PRICE

const totalPrice =

Number(quantity)
*
Number(vegetable.price);


// INSERT ORDER

const insertQuery = `
INSERT INTO orders
(

buyer_id,
buyer_name,
business_name,

farmer_id,
farmer_name,

vegetable_id,
vegetable_name,

quantity,
price_per_kg,
total_amount,

delivery_address,

buyer_latitude,
buyer_longitude,

order_status,
payment_status

)

VALUES
(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`;

db.query(

insertQuery,

[

buyer_id,
buyer_name,
business_name,

farmer_id,
farmer_name,

vegetable_id,
vegetable_name,

quantity,
vegetable.price,
totalPrice,

delivery_address,

buyer_latitude || null,
buyer_longitude || null,

"Pending",
"Pending"

],

(err,result)=>{

if(err){

console.log(err);

return res.status(500)
.json({

message:
"Order Failed ❌"

});

}


// REDUCE STOCK

db.query(

`
UPDATE vegetables1
SET quantity =
quantity - ?
WHERE id = ?
`,

[
quantity,
vegetable_id
]

);


// ADD NOTIFICATION

db.query(

`
INSERT INTO notifications
(

farmer_id,
buyer_id,

title,
message,
type,
is_read

)

VALUES
(?,?,?,?,?,0)
`,

[

farmer_id,
buyer_id,

"🛒 New Order",

`${business_name}
ordered
${quantity}KG
${vegetable_name}`,

"Order"

]

);


// REMOVE CART ITEM

db.query(

`
DELETE FROM cart
WHERE buyer_id = ?
AND vegetable_id = ?
`,

[
buyer_id,
vegetable_id
]

);


res.json({

message:
"Order Placed Successfully ✅"

});

}

);

}

);

};



// ======================
// BUYER ORDERS
// ======================

const getBuyerOrders =
(req,res)=>{

const buyerId =
req.params.buyerId;

const query = `
SELECT *
FROM orders

WHERE buyer_id = ?

ORDER BY id DESC
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
"Database Error ❌"

});

}

res.json(result);

}

);

};




// ======================
// FARMER ORDERS
// ======================

const getFarmerOrders =
(req,res)=>{

const farmerId =
req.params.farmerId;

const query = `
SELECT *
FROM orders

WHERE farmer_id = ?

ORDER BY id DESC
`;

db.query(

query,

[farmerId],

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
// ACCEPT ORDER
// ======================

const acceptOrder =
(req,res)=>{

const orderId =
req.params.id;

db.query(

`
UPDATE orders
SET order_status =
'Accepted'
WHERE id = ?
`,

[orderId],

(err)=>{

if(err){

return res.status(500)
.json({

message:
"Failed ❌"

});

}

res.json({

message:
"Order Accepted ✅"

});

}

);

};




// ======================
// REJECT ORDER
// ======================

const rejectOrder =
(req,res)=>{

const orderId =
req.params.id;


// GET ORDER

db.query(

`
SELECT *
FROM orders
WHERE id = ?
`,

[orderId],

(err,result)=>{

if(err){

return res.status(500)
.json({

message:
"Failed ❌"

});

}


if(
result.length === 0
){

return res.status(404)
.json({

message:
"Order Not Found ❌"

});

}


const order =
result[0];


// RETURN STOCK

db.query(

`
UPDATE vegetables1
SET quantity =
quantity + ?
WHERE id = ?
`,

[
order.quantity,
order.vegetable_id
]

);


// UPDATE STATUS

db.query(

`
UPDATE orders
SET order_status =
'Rejected'
WHERE id = ?
`,

[orderId]

);


res.json({

message:
"Order Rejected ❌"

});

}

);

};




// ======================
// FARMER DASHBOARD
// ======================

const getFarmerDashboard =
(req,res)=>{

const farmerId =
req.params.farmerId;

db.query(

`
SELECT

COUNT(*) AS totalOrders,

IFNULL(
SUM(total_amount),
0
)
AS revenue,

IFNULL(
SUM(quantity),
0
)
AS totalKG,

SUM(
CASE
WHEN order_status =
'Pending'
THEN 1
ELSE 0
END
)
AS pendingOrders

FROM orders

WHERE farmer_id = ?
`,

[farmerId],

(err,result)=>{

if(err){

return res.status(500)
.json({

message:
"Dashboard Error ❌"

});

}

res.json(result[0]);

}

);

};

// ======================
// ACTIVE ORDERS
// ======================

const getActiveOrders =
(req,res)=>{

const buyerId =
req.params.buyerId;

const query =

`
SELECT

id,
vegetable_name,
farmer_name,
quantity,
total_amount,
order_status

FROM orders

WHERE buyer_id = ?

AND order_status
IN
(
'Pending',
'Accepted',
'Processing',
'Shipped'
)

ORDER BY id DESC
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
"Active Orders Error ❌"

});

}

res.json(result);

}

);

};


// ======================
// REVENUE
// ======================

const getRevenueDashboard =
(req,res)=>{

const farmerId =
req.params.farmerId;

db.query(

`
SELECT

COUNT(*) AS totalOrders,

IFNULL(
SUM(total_amount),
0
)
AS totalRevenue

FROM orders

WHERE farmer_id = ?
`,

[farmerId],

(err,result)=>{

if(err){

return res.status(500)
.json({

message:
"Revenue Error ❌"

});

}

res.json(result[0]);

}

);

};




// ======================
// EXPORTS
// ======================

module.exports = {

placeOrder,
getBuyerOrders,
getFarmerOrders,
acceptOrder,
rejectOrder,
getActiveOrders,
getFarmerDashboard,
getRevenueDashboard

};