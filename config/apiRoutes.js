const express  = require('express');
const router   = express.Router();

const authentications = require('../controllers/authentications');
// const users = require('../controllers/users');
const webCams = require('../controllers/webCams');

router.route('/register')
  .post(authentications.register);
router.route('/login')
  .post(authentications.login);
router.route('/webCams')
  .get(webCams.index);

// router.route('/users')
//   .get(users.index);
// router.route('/users/:id')
//   .get(users.show)
//   .put(users.update)
//   .delete(users.delete);

module.exports = router;
