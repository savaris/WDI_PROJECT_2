const express  = require('express');
const router   = express.Router();

const authentications = require('../controllers/authentications');
const users = require('../controllers/users');
const webcams = require('../controllers/webcams');
const proxy = require('../controllers/proxy');

router.route('/register')
  .post(authentications.register);
router.route('/login')
  .post(authentications.login);
router.route('/webcams')
  .get(webcams.index);

router.route('/users')
  .get(users.index);
router.route('/users/:id')
  .get(users.show)
  .put(users.update)
  .delete(users.delete);
// router.route('/weather/:lat/:lng')
//    .get(proxy.weather);

module.exports = router;
