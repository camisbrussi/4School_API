"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _Team = require('../controllers/Team'); var _Team2 = _interopRequireDefault(_Team);

var _loginRequired = require('../middlewares/loginRequired'); var _loginRequired2 = _interopRequireDefault(_loginRequired);

const router = new (0, _express.Router)();

router.get("/:id", _loginRequired2.default, _Team2.default.show);
router.get("/", _loginRequired2.default, _Team2.default.index);
router.get("/students/:id", _loginRequired2.default, _Team2.default.getStudents);
router.post("/", _loginRequired2.default, _Team2.default.store);
router.post("/addstudents/:id", _loginRequired2.default, _Team2.default.storeStudents);
router.put("/:id", _loginRequired2.default, _Team2.default.update);
router.delete("/:id", _loginRequired2.default, _Team2.default.delete);

exports. default = router;
