
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
   database: "farm2hotel_db",
    port: 3306
});

db.connect((err) => {

    if (err) {
        console.log("Database Error ❌");
        console.log(err);
        return;
    }

    console.log("Database Connected ✅");
});

module.exports = db;