var express = require('express');
var router = express.Router();
const symbolControllers = require('../controllers').symbolControllers;
router.get('/savesymbols' , symbolControllers.save_symbols);
router.get('/save_summary' , symbolControllers.save_summary);
router.get('/getsummary' , symbolControllers.get_summary);
module.exports = router;