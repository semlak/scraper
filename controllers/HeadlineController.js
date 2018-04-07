var HeadlineModel = require('../models/HeadlineModel.js');

/**
 * HeadlineController.js
 *
 * @description :: Server-side logic for managing Headlines.
 */
module.exports = {

    /**
     * HeadlineController.list()
     */
    list: (req, res) => {
        HeadlineModel.find().sort({articleDate: -1}).exec((err, Headlines) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Headline.',
                    error: err
                });
            }
            return res.json(Headlines);
        });
    },

    /**
     * HeadlineController.show()
     */
    show: (req, res) => {
        var id = req.params.id;
        HeadlineModel.findOne({_id: id}, (err, Headline) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Headline.',
                    error: err
                });
            }
            if (!Headline) {
                return res.status(404).json({
                    message: 'No such Headline'
                });
            }
            return res.json(Headline);
        });
    },

    /**
     * HeadlineController.create()
     */
    create: (req, res) => {
        var Headline = new HeadlineModel({
			title : req.body.title,
			url : req.body.url,
			articleDate : req.body.articleDate,
			// savedDate : req.body.savedDate,
			articleNotes : req.body.articleNotes

        });

        Headline.save((err, Headline) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Headline',
                    error: err
                });
            }
            return res.status(201).json(Headline);
        });
    },

    /**
     * HeadlineController.update()
     */
    update: (req, res) => {
        var id = req.params.id;
        HeadlineModel.findOne({_id: id}, (err, Headline) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Headline',
                    error: err
                });
            }
            if (!Headline) {
                return res.status(404).json({
                    message: 'No such Headline'
                });
            }

            Headline.title = req.body.title ? req.body.title : Headline.title;
			Headline.url = req.body.url ? req.body.url : Headline.url;
			Headline.articleDate = req.body.articleDate ? req.body.articleDate : Headline.articleDate;
			Headline.savedDate = req.body.savedDate ? req.body.savedDate : Headline.savedDate;
			Headline.articleNotes = req.body.articleNotes ? req.body.articleNotes : Headline.articleNotes;

            Headline.save((err, Headline) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Headline.',
                        error: err
                    });
                }

                return res.json(Headline);
            });
        });
    },

    /**
     * HeadlineController.remove()
     */
    remove: (req, res) => {
        var id = req.params.id;
        HeadlineModel.findByIdAndRemove(id, (err, Headline) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Headline.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
