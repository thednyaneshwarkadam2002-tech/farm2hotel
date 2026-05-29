const express =
require("express");

const router =
express.Router();

const orderController =
require(
"../controllers/orderController"
);


// PLACE ORDER

router.post(
"/place",
orderController.placeOrder
);


// BUYER ORDERS

router.get(
"/buyer/:buyerId",
orderController.getBuyerOrders
);

// ACTIVE ORDERS

router.get(
"/active/:buyerId",
orderController.getActiveOrders
);


// FARMER ORDERS

router.get(
"/farmer/:farmerId",
orderController.getFarmerOrders
);


// ACCEPT ORDER

router.put(
"/accept/:id",
orderController.acceptOrder
);


// REJECT ORDER

router.put(
"/reject/:id",
orderController.rejectOrder
);


// DASHBOARD

router.get(
"/dashboard/:farmerId",
orderController.getFarmerDashboard
);


// REVENUE

router.get(
"/revenue/:farmerId",
orderController.getRevenueDashboard
);


module.exports =
router;