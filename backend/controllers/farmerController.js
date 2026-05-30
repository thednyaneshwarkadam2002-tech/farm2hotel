const db = require("../config/db");
const bcrypt = require("bcrypt");


// ====================
// REGISTER FARMER
// ====================

const registerFarmer = async (req, res) => {

    try {

        const {
            full_name,
            mobile,
            email,
            aadhaar,
            password,
            farm_name,
            farm_area,
            district,
            village
        } = req.body;


        const checkQuery = `
        SELECT * FROM farmers
        WHERE mobile = ?
        OR email = ?
        `;

        db.query(
            checkQuery,
            [mobile, email],

            async (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        message: "Database Error"
                    });

                }

                if (result.length > 0) {

                    return res.status(400).json({
                        message: "Farmer already exists"
                    });

                }

                const hashedPassword =
                    await bcrypt.hash(password, 10);


                const insertQuery = `
                INSERT INTO farmers (

                    full_name,
                    mobile,
                    email,
                    aadhaar,
                    password,
                    farm_name,
                    farm_area,
                    district,
                    village

                )

                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                db.query(

                    insertQuery,

                    [
                        full_name,
                        mobile,
                        email,
                        aadhaar,
                        hashedPassword,
                        farm_name,
                        farm_area,
                        district,
                        village
                    ],

                    (err) => {

                        if (err) {

                            console.log(err);

                            return res.status(500)
                                .json({
                                    message: err.message
                                });

                        }

                        res.status(201)
                            .json({

                                message:
                                    "Farmer Registered Successfully ✅"

                            });

                    }

                );

            }

        );

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// ====================
// LOGIN FARMER
// ====================

// ====================
// LOGIN FARMER
// ====================

const loginFarmer = (req, res) => {

console.log("BODY:", req.body);

const {
mobile,
password
} = req.body;

const query = `
SELECT * FROM farmers
WHERE mobile = ?
`;

db.query(

query,
[mobile],

async (err, result) => {

if (err) {

console.log("DB ERROR:", err);

return res.status(500)
.json({
message:"Database Error"
});

}

console.log("RESULT:", result);

if(result.length === 0){

return res.status(404)
.json({
message:"Farmer not found"
});

}

const farmer = result[0];

console.log(
"DB Password:",
farmer.password
);

const isMatch =
await bcrypt.compare(
password,
farmer.password
);

console.log(
"Password Match:",
isMatch
);

if(!isMatch){

return res.status(401)
.json({
message:
"Wrong Password"
});

}

res.status(200).json({

message:
"Login Successful ✅",

farmer:{
id: farmer.id,
full_name: farmer.full_name,
mobile: farmer.mobile
}

});

}

);

};

// ====================
// GET FARMER PROFILE
// ====================

const getFarmerProfile = (req, res) => {

    const farmerId =
        req.params.id;

    const query = `
SELECT

id,
full_name,
email,
mobile,
village,
district,
state,
pincode,
farm_name,
farm_size,
farm_type,
experience,
bio,
profile_image,
latitude,
longitude

FROM farmers

WHERE id = ?
`;

    db.query(

        query,

        [farmerId],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500)
                    .json({
                        message:
                            "Database Error"
                    });

            }

            if (result.length === 0) {

                return res.status(404)
                    .json({
                        message:
                            "Farmer not found"
                    });

            }

            res.json(
                result[0]
            );

        }

    );

};


// ====================
// UPDATE FARMER PROFILE
// ====================

const updateFarmerProfile =
    (req, res) => {

        const farmerId =
            req.params.id;

        const {

            full_name,
            mobile,
            village,
            district,
            state,
            pincode,
            farm_name,
            farm_size,
            farm_type,
            experience,
            bio,
            profile_image

        } = req.body;


        let finalProfileImage =
            profile_image;


        if (
            profile_image &&
            !profile_image.startsWith(
                "data:image"
            )
        ) {

            finalProfileImage =
                `data:image/jpeg;base64,${profile_image}`;

        }


        const query = `
        UPDATE farmers
        SET

        full_name = ?,
        mobile = ?,
        village = ?,
        district = ?,
        state = ?,
        pincode = ?,

        farm_name = ?,
        farm_size = ?,
        farm_type = ?,
        experience = ?,
        bio = ?,
        profile_image = ?

        WHERE id = ?
        `;


        db.query(

            query,

            [

                full_name,
                mobile,
                village,
                district,
                state,
                pincode,

                farm_name,
                farm_size,
                farm_type,
                experience,
                bio,
                finalProfileImage,

                farmerId

            ],

            (err) => {

                if (err) {

                    console.log(err);

                    return res.status(500)
                        .json({

                            message:
                                "Profile update failed"

                        });

                }

                res.json({

                    message:
                        "Profile updated successfully ✅"

                });

            }

        );

    };

    // ====================
// GET NEARBY FARMERS
// ====================

const getNearbyFarmers =
(req,res)=>{

const query =
`
SELECT

id,
farm_name,
village,
district,
profile_image

FROM farmers

ORDER BY id DESC

LIMIT 6
`;

db.query(

query,

(err,result)=>{

if(err){

console.log(err);

return res.status(500)
.json({

message:
"Failed to load farmers"

});

}

res.json(result);

}

);

};

// ======================
// GET NEARBY HOTELS
// ======================

// ======================
// GET NEARBY HOTELS
// ======================

const getNearbyHotels =
(req,res)=>{

const farmerId =
req.params.farmerId;

const getFarmerQuery =
`
SELECT district
FROM farmers
WHERE id = ?
`;

db.query(

getFarmerQuery,
[farmerId],

(err,farmerResult)=>{

if(err){

console.log(
"Farmer Query Error:",
err
);

return res
.status(500)
.json({

message:
"Database Error"

});

}

if(
farmerResult.length === 0
){

return res
.status(404)
.json({

message:
"Farmer Not Found"

});

}

const district =
farmerResult[0]
.district;

console.log(
"Farmer District:",
district
);

const hotelQuery =
`
SELECT *

FROM buyers

WHERE district = ?
`;

db.query(

hotelQuery,
[district],

(err,result)=>{

if(err){

console.log(
"Hotel Query Error:",
err
);

return res
.status(500)
.json({

message:
"Database Error"

});

}

console.log(
"Hotels Found:",
result
);

res.json(result);

}

);

}

);

};
// ====================
// EXPORTS
// ====================

module.exports = {

registerFarmer,
loginFarmer,
getFarmerProfile,
updateFarmerProfile,
getNearbyFarmers,
getNearbyHotels


};