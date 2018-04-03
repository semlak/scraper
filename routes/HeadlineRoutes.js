var express = require('express');
var router = express.Router();
var HeadlineController = require('../controllers/HeadlineController.js');

/*
 * GET
 */
router.get('/', HeadlineController.list);

/*
 * GET
 */
router.get('/:id', HeadlineController.show);

/*
 * POST
 */
router.post('/', HeadlineController.create);

/*
 * PUT
 */
router.put('/:id', HeadlineController.update);

/*
 * DELETE
 */
router.delete('/:id', HeadlineController.remove);

module.exports = router;
