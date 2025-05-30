const express = require('express');
const bcrypt = require('bcrypt'); 
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

module.exports = router;