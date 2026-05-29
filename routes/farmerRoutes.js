const express =
require("express");

const router =
express.Router();

const farmerController =
require(
"../controllers/farmerController"
);

const {

registerFarmer,
loginFarmer,
getFarmerProfile,
updateFarmerProfile,
getNearbyFarmers,
getNearbyHotels

}
=
farmerController;


// ==========================
// REGISTER FARMER
// ==========================

router.post(
"/register",
registerFarmer
);


// ==========================
// LOGIN FARMER
// ==========================

router.post(
"/login",
loginFarmer
);


// ==========================
// GET FARMER PROFILE
// ==========================

router.get(
"/profile/:id",
getFarmerProfile
);


// ==========================
// UPDATE FARMER PROFILE
// ==========================

router.put(
"/profile/:id",
updateFarmerProfile
);


// ==========================
// NEARBY FARMERS
// ==========================

router.get(
"/nearby",
getNearbyFarmers
);


// ==========================
// NEARBY HOTELS
// ==========================

router.get(
"/nearby-hotels/:farmerId",
getNearbyHotels
);


module.exports =
router;