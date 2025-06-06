const express = require('express');
const bcrypt = require('bcrypt'); 
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const router = express.Router();

dotenv.config(); 

const JWT_SECRET = process.env.JWT_SECRET;

const User = require("../models/userModel"); 

router.post('/register', (request, response) => {
    bcrypt
        .hash(request.body.password, 10)
        .then((hashedPassword) => {
            const user = new User({
                name: request.body.name,
                email: request.body.email,
                password: hashedPassword,
                avatar: request.body.avatar,
            });

            user
                .save()
                .then((result) => {
                    response.status(201).send({
                        message: "User Created Successfully",
                        result,
                    });
                })
                .catch((error) => {
                    response.status(500).send({
                        message: "Error creating user",
                        error,
                    });
                });
        })
        .catch((e) => {
            response.status(500).send({
                message: "Password was not hashed successfully",
                e,
            });
        });
}); 

router.post('/login', (request, response) => {
    User.findOne({ email: request.body.email })
        .then((user) => {
            bcrypt.compare(request.body.password, user.password)
                .then((passwordCheck) => {
                    if (!passwordCheck) {
                        return response.status(400).send({
                            message: "Passwords does not match",
                            error, 
                        });
                    }

                    const token = jwt.sign(
                        {
                            userId: user._id,
                            userEmail: user.email, 
                        },
                        JWT_SECRET,
                        {
                            expiresIn: "24h"
                        }
                    );

                    response.status(200).send({
                        message: "Login Successful",
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            avatar: user.avatar
                        },
                        token,
                    });
                }) 
                .catch((error) => {
                    response.status(400).send({
                        message: "An error occurred while checking the password",
                        error, 
                    });
                })
        })
        .catch((e) => {
            response.status(404).send({
                message: "Email not found",
                e, 
            }); 
        }); 
}); 

module.exports = router;