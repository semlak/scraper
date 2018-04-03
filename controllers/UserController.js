var UserModel = require('../models/UserModel.js');

/**
 * UserController.js
 *
 * @description :: Server-side logic for managing Users.
 */
module.exports = {

    /**
     * UserController.list()
     */
    list: (req, res) => {
        console.log(req.header)
        UserModel.find((err, Users) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }
            return res.json(Users);
        });
    },

    /**
     * UserController.show()
     */
    show: (req, res) => {
        var id = req.params.id;
        UserModel.findOne({_id: id}, (err, User) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }
            if (!User) {
                return res.status(404).json({
                    message: 'No such User'
                });
            }
            return res.json(User);
        });
    },

    /**
     * UserController.create()
     */
    create: (req, res) => {
        var user = new UserModel({
            name : req.body.name,
            password: req.body.password,
            email : req.body.email,
            savedArticles : req.body.savedArticles || []
        });

        // if this is the first user created, set role to 'admin', otherwise to 'user'
        User.find((err, users) => {
            user.role = (users.length < 1) ? 'admin' : 'user'
            User.save((err, User) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating User',
                        error: err
                    });
                }
                return res.status(201).json(User);
            });
        })

    },

    login: (req, res) => {

    },

    /**
     * UserController.update()
     */
    update: (req, res) => {
        var id = req.params.id;
        UserModel.findOne({_id: id}, (err, User) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User',
                    error: err
                });
            }
            if (!User) {
                return res.status(404).json({
                    message: 'No such User'
                });
            }

            User.name = req.body.name ? req.body.name : User.name;
			// User.password = req.body.password ? req.body.password : User.password;
			// User.passwordsalt = req.body.passwordsalt ? req.body.passwordsalt : User.passwordsalt;
			User.email = req.body.email ? req.body.email : User.email;
			User.savedArticles = req.body.savedArticles ? req.body.savedArticles : User.savedArticles;

            User.save((err, User) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating User.',
                        error: err
                    });
                }

                return res.json(User);
            });
        });
    },

    /**
     * UserController.remove()
     */
    remove: (req, res) => {
        var id = req.params.id;
        UserModel.findByIdAndRemove(id, (err, User) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the User.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
