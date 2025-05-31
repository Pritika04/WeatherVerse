const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");

dotenv.config(); 

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (request, response, next) => {
    try {
        if (!request.headers.authorization) {
            return res.status(401).json({ 
                message: "Authorization header missing",
                error: error.message
            });
        }

        const token = await request.headers.authorization.split(" ")[1]; 

        if (!token) {
            return res.status(401).json({ 
                message: "Token missing",
                error: error.message
            });
        }

        const decodedToken = await jwt.verify(
            token,
            JWT_SECRET
        );

        const user = await decodedToken;
        request.user = user;
        next(); 

    } catch (error) {
        response.status(401).json({
            message: "Invalid request!",
            error: error.message
        })
    }
}
