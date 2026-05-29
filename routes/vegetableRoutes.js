const express =
require("express");

const router =
express.Router();

const multer =
require("multer");

const path =
require("path");

const fs =
require("fs");

const {

addVegetable,
getVegetables,
getGroupedVegetables,
getDashboardStats,
deleteVegetable,
updateVegetable

}
=
require(
"../controllers/vegetableController"
);


// ====================
// MULTER IMAGE UPLOAD
// ====================

const storage =
multer.diskStorage({

destination:
(req,file,cb)=>{

const uploadPath =
path.join(
__dirname,
"../../uploads"
);

if(
!fs.existsSync(
uploadPath
)
){
fs.mkdirSync(
uploadPath,
{
recursive:true
}
);
}

cb(
null,
uploadPath
);

},

filename:
(req,file,cb)=>{

cb(

null,

Date.now()
+
path.extname(
file.originalname
)

);

}

});

const upload =
multer({
storage
});


// ====================
// ADD VEGETABLE
// ====================

router.post(

"/add",

upload.single(
"image"
),

addVegetable

);


// ====================
// GET ALL VEGETABLES
// ====================

router.get(
"/",
getVegetables
);


// ====================
// LIVE DASHBOARD
// ====================

router.get(

"/dashboard/:id",

getDashboardStats

);


// ====================
// DELETE VEGETABLE
// ====================

router.delete(

"/delete/:id",

deleteVegetable

);


// ====================
// UPDATE VEGETABLE
// ====================

router.put(

"/update/:id",

updateVegetable

);

module.exports =
router;