var NoteModel = require('../models/NoteModel.js');
var HeadlineModel = require('../models/HeadlineModel.js');

/**
 * NoteController.js
 *
 * @description :: Server-side logic for managing Notes.
 */
module.exports = {

    /**
     * NoteController.list()
     */
    list: (req, res) => {
        NoteModel.find((err, Notes) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Note.',
                    error: err
                });
            }
            return res.json(Notes);
        });
    },

    /**
     * NoteController.show()
     */
    show: (req, res) => {
        var id = req.params.id;
        NoteModel.findOne({_id: id}, (err, Note) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Note.',
                    error: err
                });
            }
            if (!Note) {
                return res.status(404).json({
                    message: 'No such Note'
                });
            }
            return res.json(Note);
        });
    },

    /**
     * NoteController.create()
     */
    create: (req, res) => {
        var Note = new NoteModel({
			body : req.body.body,
			articleId : req.body.articleId,
			// userId : req.body.userId,
            userId: null,
			likes : []

        });

        Note.save((err, Note) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Note',
                    error: err
                });
            }
            HeadlineModel.findById(Note.articleId).then(headline => {
                headline.articleNotes.push(Note);
                headline.save().then(res.status(201).json(Note))
            })
            // return res.status(201).json(Note);

        });
    },

    /**
     * NoteController.update()
     */
    update: (req, res) => {
        var id = req.params.id;
        NoteModel.findOne({_id: id}, (err, Note) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Note',
                    error: err
                });
            }
            if (!Note) {
                return res.status(404).json({
                    message: 'No such Note'
                });
            }

            Note.body = req.body.body ? req.body.body : Note.body;
			Note.articleId = req.body.articleId ? req.body.articleId : Note.articleId;
			Note.userId = req.body.userId ? req.body.userId : Note.userId;
			Note.likes = req.body.likes ? req.body.likes : Note.likes;

            Note.save((err, Note) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Note.',
                        error: err
                    });
                }

                return res.json(Note);
            });
        });
    },

    /**
     * NoteController.remove()
     */
    remove: (req, res) => {
        var id = req.params.id;
        NoteModel.findByIdAndRemove(id, (err, Note) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Note.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
