"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _Error = require('../controllers/Error'); var _Error2 = _interopRequireDefault(_Error);

var _loginRequired = require('../middlewares/loginRequired'); var _loginRequired2 = _interopRequireDefault(_loginRequired);

const router = new (0, _express.Router)();

router.get('/', _Error2.default.index);
router.get('/:data', _loginRequired2.default, _Error2.default.show);


exports. default = router;
