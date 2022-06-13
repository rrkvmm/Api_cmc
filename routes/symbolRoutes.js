var express = require('express');
var router = express.Router();
const symbolControllers = require('../controllers').symbolControllers;
router.get('/savesymbols' , symbolControllers.save_symbols);
router.get('/save_summary' , symbolControllers.save_summary);
router.get('/getsummary' , symbolControllers.get_summary);
router.get('/get_web_socket' , symbolControllers.get_web_socket);
router.get('/save_tickers' , symbolControllers.save_Tickers);
router.get('/get_tickers' , symbolControllers.get_tickers);
router.get('/get_asset' , symbolControllers.get_asset);
router.get('/save_trades' , symbolControllers.save_Trades);
router.get('/get_trades' , symbolControllers.get_trades);
router.get('/get_order_book' , symbolControllers.get_order_book);

// router.get('/get_coin_data' , symbolControllers.get_coin_data);


module.exports = router;