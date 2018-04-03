var LikeModel = require('../models/LikeModel.js');

/**
 * LikeController.js
 *
 * @description :: Server-side logic for managing Likes.
 */
module.exports = {

    /**
     * LikeController.list()
     */
    list: (req, res) => {
        LikeModel.find((err, Likes) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Like.',
                    error: err
                });
            }
            return res.json(Likes);
        });
    },

    /**
     * LikeController.show()
     */
    show: (req, res) => {
        var id = req.params.id;
        LikeModel.findOne({_id: id}, (err, Like) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Like.',
                    error: err
                });
            }
            if (!Like) {
                return res.status(404).json({
                    message: 'No such Like'
                });
            }
            return res.json(Like);
        });
    },

    /**
     * LikeController.create()
     */
    create: (req, res) => {
        var Like = new LikeModel({
			userId : req.body.userId,
			noteId : req.body.noteId

        });

        Like.save((err, Like) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Like',
                    error: err
                });
            }
            return res.status(201).json(Like);
        });
    },

    /**
     * LikeController.update()
     */
    update: (req, res) => {
        var id = req.params.id;
        LikeModel.findOne({_id: id}, (err, Like) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Like',
                    error: err
                });
            }
            if (!Like) {
                return res.status(404).json({
                    message: 'No such Like'
                });
            }

            Like.userId = req.body.userId ? req.body.userId : Like.userId;
			Like.noteId = req.body.noteId ? req.body.noteId : Like.noteId;

            Like.save((err, Like) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Like.',
                        error: err
                    });
                }

                return res.json(Like);
            });
        });
    },

    /**
     * LikeController.remove()
     */
    remove: (req, res) => {
        var id = req.params.id;
        LikeModel.findByIdAndRemove(id, (err, Like) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Like.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
