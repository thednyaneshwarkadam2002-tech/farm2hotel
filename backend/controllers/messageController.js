const db =
require("../config/db");


// ======================
// SEND MESSAGE
// ======================

const sendMessage =
(req,res)=>{

const {

sender_id,
sender_type,
receiver_id,
receiver_type,
message

}

=

req.body;

if(

!sender_id ||
!sender_type ||
!receiver_id ||
!receiver_type ||
!message

){

return res.status(400)
.json({

message:
"All fields required"

});

}

const query =
`
INSERT INTO messages (

sender_id,
sender_type,

receiver_id,
receiver_type,

message

)

VALUES (?, ?, ?, ?, ?)
`;

db.query(

query,

[
sender_id,
sender_type,
receiver_id,
receiver_type,
message
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

const notificationQuery =
`
INSERT INTO notifications (

farmer_id,
buyer_id,
title,
message,
type

)

VALUES (?, ?, ?, ?, ?)
`;


// BUYER → FARMER

if(receiver_type === "Farmer"){

db.query(

notificationQuery,

[
receiver_id,
sender_id,

"💬 New Message",

"You received a new message",

"Message"
]

);

}


// FARMER → BUYER

if(sender_type === "Farmer"){

db.query(

notificationQuery,

[
sender_id,
receiver_id,

"💬 Message Sent",

"Farmer sent a message",

"Message"
]

);

}

res.json({

message:
"Message Sent ✅"

});

}

);

};


// ======================
// GET CHAT
// ======================

const getChat =
(req,res)=>{

const {

farmerId,
buyerId

}

=

req.params;

const query =
`
SELECT *
FROM messages

WHERE

(

sender_id = ?
AND receiver_id = ?

)

OR

(

sender_id = ?
AND receiver_id = ?

)

ORDER BY created_at ASC
`;

db.query(

query,

[
farmerId,
buyerId,
buyerId,
farmerId
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

res.json(result);

}

);

};


// ======================
// BUYERS LIST
// ======================

const getBuyerChats =
(req,res)=>{

const farmerId =
req.params.id;

const query =
`
SELECT DISTINCT

b.id,
b.business_name

FROM messages m

JOIN buyers b

ON (

b.id = m.sender_id

OR

b.id = m.receiver_id

)

WHERE

m.sender_type = 'Buyer'

AND m.receiver_id = ?
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
"Database Error"

});

}

res.json(result);

}

);

};

const getFarmerChats =
(req,res)=>{

const buyerId =
req.params.id;

const query =
`
SELECT DISTINCT

f.id,
f.full_name AS farmer_name

FROM messages m

JOIN farmers f

ON (

f.id = m.sender_id

OR

f.id = m.receiver_id

)

WHERE

m.receiver_type = 'Buyer'

AND m.receiver_id = ?
`;

db.query(

query,

[buyerId],

(err,result)=>{

if(err){

console.log(err);

return res
.status(500)
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
// GET FARMER BUYERS
// ======================

const getFarmerBuyers =
(req,res)=>{

const farmerId =
req.params.id;

const query =
`
SELECT DISTINCT

b.id,
b.business_name

FROM messages m

JOIN buyers b

ON b.id = m.sender_id

WHERE
m.receiver_id = ?
AND m.receiver_type = 'Farmer'
`;

db.query(

query,

[farmerId],

(err,result)=>{

if(err){

console.log(err);

return res
.status(500)
.json({

message:
"Database Error"

});

}

res.json(result);

}

);

};

module.exports = {

sendMessage,
getChat,
getFarmerBuyers,
getBuyerChats,
getFarmerChats

};