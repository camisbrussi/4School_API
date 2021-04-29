"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');
var _Activity = require('../controllers/Activity'); var _Activity2 = _interopRequireDefault(_Activity);

var _loginRequired = require('../middlewares/loginRequired'); var _loginRequired2 = _interopRequireDefault(_loginRequired);

const router = new (0, _express.Router)();

router.get("/:id", _loginRequired2.default, _Activity2.default.show);
router.get("/", _loginRequired2.default, _Activity2.default.index);
router.post("/", _loginRequired2.default, _Activity2.default.store);
router.put("/:id", _loginRequired2.default, _Activity2.default.update);
router.delete("/:id", _loginRequired2.default, _Activity2.default.delete);
router.get("/participants/:id", _loginRequired2.default, _Activity2.default.showParticipants);
router.get("/participants/teachers/:id", _loginRequired2.default, _Activity2.default.showParticipantsTeachers);
router.post("/addparticipants/:id", _loginRequired2.default, _Activity2.default.storeParticipants);

exports. default = router;
