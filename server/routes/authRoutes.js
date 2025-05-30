const express = require('express');
const bcrypt = require('bcrypt'); 
const jwt = require("jsonwebtoken");
const router = express.Router();

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
                        "RANDOM_TOKEN",
                        {
                            expiresIn: "24h"
                        }
                    );

                    response.status(200).send({
                        message: "Login Successful",
                        email: user.email,
                        token,
                    });
                }) 
                .catch((error) => {
                    response.status(400).send({
                        message: "Passwords does not match",
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