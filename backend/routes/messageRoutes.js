const express =
require("express");

const router =
express.Router();

const {

sendMessage,
getChat,
getFarmerBuyers,
getFarmerChats

}

=

require(
"../controllers/messageController"
);


// ==========================
// SEND MESSAGE
// ==========================

router.post(
"/send",
sendMessage
);


// ==========================
// GET CHAT
// FARMER ↔ BUYER CHAT
// ==========================

router.get(
"/chat/:farmerId/:buyerId",
getChat
);


// ==========================
// FARMER SIDE
// GET ALL BUYERS
// ==========================

router.get(
"/buyers/:id",
getFarmerBuyers
);


// ==========================
// BUYER SIDE
// GET ALL FARMER CHATS
// ==========================

router.get(
"/farmers/:id",
getFarmerChats
);


module.exports =
router;