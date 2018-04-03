var express = require('express');
var router = express.Router();
var NoteController = require('../controllers/NoteController.js');

/*
 * GET
 */
router.get('/', NoteController.list);

/*
 * GET
 */
router.get('/:id', NoteController.show);

/*
 * POST
 */
router.post('/', NoteController.create);

/*
 * PUT
 */
router.put('/:id', NoteController.update);

/*
 * DELETE
 */
router.delete('/:id', NoteController.remove);

module.exports = router;
