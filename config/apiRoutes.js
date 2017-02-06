const express  = require('express');
const router   = express.Router();

const authentications = require('../controllers/authentications');
const users           = require('../controllers/users');
const webcams         = require('../controllers/webcams');
const proxies         = require('../controllers/proxies');

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
router.route('/forecast/:lat/:lng')
   .get(proxies.forecast);

module.exports = router;
