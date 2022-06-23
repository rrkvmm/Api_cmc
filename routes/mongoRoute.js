var express = require('express');
var router = express.Router();
const mongodb_controllers = require('../controllers').mongodb_controllers;
router.get('/create_collection'  ,       mongodb_controllers.create_collection_in_mongo);
router.get('/create_symbol'      ,       mongodb_controllers.create_symbol_in_mongo);
router.get('/create_coin_market' ,       mongodb_controllers.create_coin_market_in_mongo);
router.get('/save_summary'       ,       mongodb_controllers.save_summary_in_mongo);
router.get('/save_tickers'       ,       mongodb_controllers.save_tickers_in_mongo);



router.get('/get_summary' , mongodb_controllers.get_summary_with_json);
router.get('/get_tickers' , mongodb_controllers.get_tickers_with_json);
router.get('/get_traders' , mongodb_controllers.get_traders_with_json);
router.get('/get_asset'   , mongodb_controllers.get_asset);
router.get('/get_order_book'   , mongodb_controllers.get_order_book);

router.get('/save_summary_in_mongo_with_json' , mongodb_controllers.save_summary_in_mongo_with_json);
router.get('/save_tickers_in_mongo_with_json' , mongodb_controllers.save_tickers_in_mongo_with_json);
router.get('/save_Trades_in_mongo_with_json' , mongodb_controllers.save_Trades_in_mongo_with_json);
module.exports = router;