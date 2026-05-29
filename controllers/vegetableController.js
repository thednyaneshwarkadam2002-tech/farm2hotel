const db =
require("../config/db");


// ====================
// ADD VEGETABLE
// ====================

const addVegetable =
(req,res)=>{

try{

const {

farmer_id,
vegetable_name,
category,
quantity,
price,
min_order,
harvest_date,
delivery,
delivery_radius,
description,
latitude,
longitude

}
=
req.body;


if(
!farmer_id ||
!vegetable_name ||
!category ||
!quantity ||
!price
){

return res
.status(400)
.json({

message:
"Required fields missing ❌"

});

}

const image =
req.file
? req.file.filename
: null;

const sql =
`
INSERT INTO vegetables1(

farmer_id,
vegetable_name,
category,
quantity,
price,
min_order,
harvest_date,
delivery,
delivery_radius,
description,
image,
latitude,
longitude

)

VALUES
(?,?,?,?,?,?,?,?,?,?,?,?,?)
`;

db.query(

sql,

[
farmer_id,
vegetable_name,
category,
quantity,
price,
min_order || 1,
harvest_date || null,
delivery || "No",
delivery_radius || 0,
description || null,
image,
latitude || null,
longitude || null
],

(err,result)=>{

if(err){

console.log(err);

return res
.status(500)
.json({

message:
"Database Error ❌"

});

}

res.status(201)
.json({

message:
"Vegetable Added Successfully ✅",

vegetableId:
result.insertId

});

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


// ====================
// GET ALL VEGETABLES
// ====================

const getVegetables =
(req,res)=>{

const query =
`
SELECT

v.*,
f.full_name,
f.farm_name,
f.mobile

FROM vegetables1 v

LEFT JOIN farmers f
ON v.farmer_id = f.id

ORDER BY v.id DESC
`;

db.query(

query,

(err,result)=>{

if(err){

console.log(err);

return res
.status(500)
.json({

message:
"Database Error ❌"

});

}

res.json(result);

}

);

};


// ====================
// GROUPED VEGETABLES
// ====================

const getGroupedVegetables =
(req,res)=>{

const query =
`
SELECT

vegetable_name,

COUNT(DISTINCT farmer_id)
AS total_farmers,

MIN(price)
AS lowest_price,

SUM(quantity)
AS total_stock,

MAX(image)
AS image

FROM vegetables1

GROUP BY vegetable_name

ORDER BY vegetable_name ASC
`;

db.query(

query,

(err,result)=>{

if(err){

console.log(err);

return res
.status(500)
.json({

message:
"Database Error ❌"

});

}

res.json(result);

}

);

};

// ====================
// LIVE DASHBOARD STATS
// ====================

const getDashboardStats =
(req,res)=>{

const farmerId =
req.params.id;

const query =
`
SELECT

COUNT(id)
AS activeListings,

COALESCE(
SUM(quantity),
0
)
AS totalStock,

COALESCE(
ROUND(
AVG(price),
2
),
0
)
AS avgPrice,

COUNT(
CASE
WHEN quantity < 20
THEN 1
END
)
AS lowStock

FROM vegetables1

WHERE farmer_id = ?
`;

db.query(

query,
[farmerId],

(err,result)=>{

if(err){

console.log(
"Dashboard Error:",
err
);

return res
.status(500)
.json({

message:
"Dashboard Error"

});

}

console.log(
"LIVE Dashboard:",
result[0]
);

res.json({

activeListings:
Number(
result[0]
.activeListings
) || 0,

totalStock:
Number(
result[0]
.totalStock
) || 0,

avgPrice:
Number(
result[0]
.avgPrice
) || 0,

lowStock:
Number(
result[0]
.lowStock
) || 0

});

}

);

};


// ====================
// DELETE VEGETABLE
// ====================

const deleteVegetable =
(req,res)=>{

const id =
req.params.id;

const query =
`
DELETE FROM vegetables1
WHERE id = ?
`;

db.query(

query,
[id],

(err,result)=>{

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
"Vegetable Deleted Successfully ✅"

});

}

);

};


// ====================
// UPDATE VEGETABLE
// ====================

const updateVegetable =
(req,res)=>{

const id =
req.params.id;

const {
price,
quantity
}
=
req.body;

const query =
`
UPDATE vegetables1

SET
price = ?,
quantity = ?

WHERE id = ?
`;

db.query(

query,

[
price,
quantity,
id
],

(err,result)=>{

if(err){

console.log(err);

return res
.status(500)
.json({

message:
"Update Failed ❌"

});

}

res.json({

message:
"Vegetable Updated Successfully ✅"

});

}

);

};


// ====================
// EXPORTS
// ====================

module.exports = {

addVegetable,
getVegetables,
getGroupedVegetables,
getDashboardStats,
deleteVegetable,
updateVegetable

};