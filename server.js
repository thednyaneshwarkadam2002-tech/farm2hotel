const express =
require("express");

const cors =
require("cors");

const path =
require("path");

const http =
require("http");

const { Server } =
require("socket.io");

const db =
require("./config/db");

const app =
express();


// ======================
// MIDDLEWARE
// ======================

app.use(cors());

app.use(
express.json()
);

app.use(
express.urlencoded({
extended:true
})
);


// ======================
// STATIC UPLOADS
// ======================

app.use(
"/uploads",
express.static(
path.resolve(
__dirname,
"../uploads"
)
)
);

const marketRoutes =
require("./routes/marketRoutes");

app.use(
"/api/market",
marketRoutes
);


// ======================
// ROUTES IMPORT
// ======================

const vegetableRoutes =
require(
"./routes/vegetableRoutes"
);

const farmerRoutes =
require(
"./routes/farmerRoutes"
);

const buyerRoutes =
require(
"./routes/buyerRoutes"
);

const orderRoutes =
require(
"./routes/orderRoutes"
);

const messageRoutes =
require(
"./routes/messageRoutes"
);

const notificationRoutes =
require(
"./routes/notificationRoutes"
);

const cartRoutes =
require(
"./routes/cartRoutes"
);

const wishlistRoutes =
require(
"./routes/wishlistRoutes"
);


// ======================
// API ROUTES
// ======================

app.use(
"/api/vegetables",
vegetableRoutes
);

app.use(
"/api/farmers",
farmerRoutes
);

app.use(
"/api/buyers",
buyerRoutes
);

app.use(
"/api/orders",
orderRoutes
);

app.use(
"/api/messages",
messageRoutes
);

app.use(
"/api/cart",
cartRoutes
);

app.use(
"/api/wishlist",
wishlistRoutes
);

app.use(
"/api/notifications",
notificationRoutes
);


// ======================
// TEST ROUTE
// ======================

app.get(
"/",
(req,res)=>{

res.send(
"Farm2Hotel Server Running 🚀"
);

}
);


// ======================
// LIVE HOME STATS API
// ======================

app.get(

"/api/stats",

(req,res)=>{

const stats = {};

db.query(

"SELECT COUNT(*) AS totalFarmers FROM farmers",

(err,farmerResult)=>{

if(err){

return res
.status(500)
.json({
message:
"Database Error"
});

}

stats.farmers =
farmerResult[0]
.totalFarmers;


db.query(

"SELECT COUNT(*) AS totalBuyers FROM buyers",

(err,buyerResult)=>{

if(err){

return res
.status(500)
.json({
message:
"Database Error"
});

}

stats.buyers =
buyerResult[0]
.totalBuyers;


db.query(

"SELECT COUNT(*) AS totalOrders FROM orders",

(err,orderResult)=>{

if(err){

return res
.status(500)
.json({
message:
"Database Error"
});

}

stats.orders =
orderResult[0]
.totalOrders;


db.query(

"SELECT COUNT(DISTINCT district) AS totalCities FROM farmers",

(err,cityResult)=>{

if(err){

return res
.status(500)
.json({
message:
"Database Error"
});

}

stats.cities =
cityResult[0]
.totalCities;

res.json(stats);

});

});

});

});

});


// ======================
// SOCKET SERVER
// ======================

const server =
http.createServer(app);

const io =
new Server(server,{

cors:{
origin:"*"
}

});

app.set(
"io",
io
);


// ======================
// SOCKET CONNECTION
// ======================

io.on(

"connection",

(socket)=>{

console.log(
"User Connected:",
socket.id
);


// BUYER ROOM

socket.on(

"joinBuyer",

buyerId=>{

socket.join(
`buyer_${buyerId}`
);

console.log(
`Buyer Joined: buyer_${buyerId}`
);

}

);


// FARMER ROOM

socket.on(

"joinFarmer",

farmerId=>{

socket.join(
`farmer_${farmerId}`
);

console.log(
`Farmer Joined: farmer_${farmerId}`
);

}

);


socket.on(

"disconnect",

()=>{

console.log(
"User Disconnected"
);

}

);

}

);


// ======================
// SERVER START
// ======================

const PORT =
5000;

server.listen(

PORT,

()=>{

console.log(
`Server Running on Port ${PORT} 🚀`
);

}

);