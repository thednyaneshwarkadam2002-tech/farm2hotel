const db =
require("../config/db");


// =====================
// GET NOTIFICATIONS
// =====================

const getNotifications =
(req,res)=>{

const farmerId =
req.params.farmerId;

const query =
`
SELECT *

FROM notifications

WHERE farmer_id = ?

ORDER BY id DESC
`;

db.query(

query,
[farmerId],

(err,result)=>{

if(err){

console.log(
"Notification Error:",
err
);

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


// =====================
// ADD NOTIFICATION
// =====================

const addNotification =
(req,res)=>{

const {

farmer_id,
message

}
=
req.body;

const query =
`
INSERT INTO notifications(

farmer_id,
message,
is_read

)

VALUES
(?, ?, 0)
`;

db.query(

query,

[
farmer_id,
message
],

(err,result)=>{

if(err){

console.log(err);

return res
.status(500)
.json({

message:
"Failed"

});

}

res.json({

message:
"Notification Added ✅"

});

}

);

};


// =====================
// MARK AS READ
// =====================

const markAsRead =
(req,res)=>{

const id =
req.params.id;

const query =
`
UPDATE notifications

SET is_read = 1

WHERE id = ?
`;

db.query(

query,
[id],

(err)=>{

if(err){

return res
.status(500)
.json({

message:
"Failed"

});

}

res.json({

message:
"Updated ✅"

});

}

);

};
// ======================
// DELETE SINGLE NOTIFICATION
// ======================

const deleteNotification =
(req,res)=>{

const id =
req.params.id;

const query =
`
DELETE FROM notifications
WHERE id = ?
`;

db.query(

query,
[id],

(err)=>{

if(err){

console.log(err);

return res
.status(500)
.json({

message:
"Delete Failed ❌"

});

}

res.json({

message:
"Notification Deleted ✅"

});

}

);

};


// ======================
// CLEAR ALL NOTIFICATIONS
// ======================

// ======================
// CLEAR ALL NOTIFICATIONS
// ======================

const clearNotifications =
(req,res)=>{

const farmerId =
req.params.farmerId;

const query =
`
DELETE FROM notifications

WHERE farmer_id = ?
`;

db.query(

query,

[
farmerId
],

(err)=>{

if(err){

console.log(err);

return res
.status(500)
.json({

message:
"Reset Failed ❌"

});

}

res.json({

message:
"All Notifications Cleared ✅"

});

}

);

};


module.exports = {

getNotifications,
addNotification,
markAsRead,
deleteNotification,
clearNotifications

};