var express = require('express');
var router = express.Router();
var LikeController = require('../controllers/LikeController.js');

/*
 * GET
 */
router.get('/', LikeController.list);

/*
 * GET
 */
router.get('/:id', LikeController.show);

/*
 * POST
 */
router.post('/', LikeController.create);

/*
 * PUT
 */
router.put('/:id', LikeController.update);

/*
 * DELETE
 */
router.delete('/:id', LikeController.remove);

module.exports = router;
