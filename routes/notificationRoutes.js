const express =
require("express");

const router =
express.Router();

const {

getNotifications,
addNotification,
markAsRead,
deleteNotification,
clearNotifications

}
=
require(
"../controllers/notificationController"
);


// =====================
// GET NOTIFICATIONS
// =====================

router.get(

"/:farmerId",

getNotifications

);


// =====================
// ADD NOTIFICATION
// =====================

router.post(

"/add",

addNotification

);


// =====================
// MARK AS READ
// =====================

router.put(

"/read/:id",

markAsRead

);

// ======================
// DELETE NOTIFICATION
// ======================

router.delete(

"/delete/:id",

deleteNotification

);


// ======================
// CLEAR ALL NOTIFICATIONS
// ======================

router.delete(

"/clear/:id",

clearNotifications

);


module.exports =
router;