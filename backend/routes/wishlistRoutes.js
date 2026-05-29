const express =
require("express");

const router =
express.Router();


const {

addToWishlist,
getWishlist,
removeWishlist

} = require(
"../controllers/wishlistController"
);


// ======================
// ADD WISHLIST
// ======================

router.post(
"/add",
addToWishlist
);


// ======================
// GET WISHLIST
// ======================

router.get(
"/:buyerId",
getWishlist
);


// ======================
// DELETE WISHLIST
// ======================

router.delete(
"/delete/:id",
removeWishlist
);


module.exports =
router;