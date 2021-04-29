"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _Info = require('../controllers/Info'); var _Info2 = _interopRequireDefault(_Info);

var _loginRequired = require('../middlewares/loginRequired'); var _loginRequired2 = _interopRequireDefault(_loginRequired);

const router = new (0, _express.Router)();

router.get('/', _Info2.default.index);
router.get('/show/:arquive', _Info2.default.show);
router.post('/filter', _Info2.default.filterIndex);


exports. default = router;
