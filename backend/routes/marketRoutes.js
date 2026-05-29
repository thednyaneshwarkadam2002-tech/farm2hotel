const express =
require("express");

const router =
express.Router();

const db =
require("../config/db");


// ======================
// GROUP VEGETABLES
// ======================

router.get(
"/vegetables-grouped",

(req,res)=>{

const query = `

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

FROM vegetables

GROUP BY vegetable_name

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

}

);

module.exports =
router;