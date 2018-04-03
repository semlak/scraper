var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');

/*
 * GET
 */
router.get('/', UserController.list);

/*
 * GET
 */
router.get('/:id', UserController.show);

/*
 * POST
 */
router.post('/register', UserController.create);

router.post('/login', UserController.login)
// router.post('/users/register', (req, res, next) => {
//   console.log('Received request to register an user (a POST request to \'/api/users/register\')');
//   // if this is the first account created for the application, it should be an admin user. Otherwise, it will be standard user.
//   var role;
//   Account.find((err, accounts) => {
//     if (err) {
//       res.json(err);
//     }
//     else {
//       if (accounts.length == 0) {
//         role = 'admin';
//       }
//       else {
//         role = 'user';
//       }
//       // Account.register(new Account({ username : req.body.username, fullname: req.body.fullname, email: req.body.email, role: role }), req.body.password, (err, account) => {
//       Account.register(new Account({
//         username : req.body.username,
//         fullname: req.body.fullname,
//         email: req.body.email,
//         role: role
//       }), req.body.password, (err) => {
//         if (err) {
//           res.json(err);
//         }
//         else {
//           passport.authenticate('local') (req, res, () => {
//             req.session.save((err) => {
//               if (err) {
//                 return next(err);
//               }
//               else {
//                 res.json({error: false, message: 'Successfully registered.', authorizedUser: reqUserInfo(req.user)});
//               }
//             });
//           });
//         }
//       });
//     }
//   });
// });



/*
 * PUT
 */
router.put('/:id', UserController.update);

/*
 * DELETE
 */
router.delete('/:id', UserController.remove);

module.exports = router;
