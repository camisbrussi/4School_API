"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _Person = require('../controllers/Person'); var _Person2 = _interopRequireDefault(_Person);

var _loginRequired = require('../middlewares/loginRequired'); var _loginRequired2 = _interopRequireDefault(_loginRequired);

const router = new (0, _express.Router)();

router.get("/:id", _loginRequired2.default, _Person2.default.show);
router.get("/", _loginRequired2.default, _Person2.default.index);
router.post("/", _loginRequired2.default, _Person2.default.store);
router.put("/:id", _loginRequired2.default, _Person2.default.update);
router.delete("/:id", _loginRequired2.default, _Person2.default.delete);

exports. default = router;
