const Utility = require('./Utility');
const symbols = require('../models').symbols;
const symbolTicker = require('../models').symbol_ticker;
const coin_market = require('../models').coin_market;
const ticker = require('../models').ticker;
const trades = require('../models').trades;
const fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
const mongodb = require("mongodb").schema;
const constant = require('./constant');
module.exports = {
   
    async save_summary_in_mongo_with_json() {
        try {
            MongoClient.connect(process.env.MONGO_URL, async function (err, db) {
                if (err) throw err;
                var dbo = db.db(process.env.DB_Name);
                var summary_array = new Array()
                var ticker_array = new Array()
                let result_data = await dbo.collection("symbol").find({}).toArray(async function (err, result) {
                    const requests = result.map((tag) =>
                        Utility.Get_Request_By_Axios("https://openapi.lyotrade.com/sapi/v1/ticker?symbol=" + tag.symbol, {})
                    );
                    const api_result = await Promise.all(requests);
                    api_result.map((api_item, index) => {
                        if (api_item.status == 200) {
                            let item = result[index]
                            let json_api_response = JSON.parse(api_item.data)
                            let apiresponse = json_api_response.data
                            var object_item =
                            {
                                trading_pairs: (item.baseAsset + "_" + item.quoteAsset),
                                base_currency: item.baseAsset,
                                quote_currency: item.quoteAsset,
                                last_price: apiresponse.last,
                                lowest_ask: apiresponse.low,
                                price_change_percent_24h: apiresponse.rose,
                                base_volume: apiresponse.vol,
                                highest_bid: apiresponse.buy,
                                highest_price_24h: apiresponse.high,
                                lowest_price_24h: apiresponse.low,
    
                            };
                            var ticker_item = {
                                symbol: (item.baseAsset + "_" + item.quoteAsset),
                                base_id: item.base_asset_id,
                                quote_id: item.quote_asset_id,
                                last_price: apiresponse.last,
                                base_volume: apiresponse.vol,
                                quote_volume: (apiresponse.last * apiresponse.vol),
                                isFrozen: 1,
                            }
                            var main_object = {}
                            main_object[(item.baseAsset + "_" + item.quoteAsset)] = object_item
                            var ticker_main_item = {}
                            ticker_main_item[(item.baseAsset + "_" + item.quoteAsset)] = ticker_item
                            ticker_array.push(ticker_main_item)
                            summary_array.push(main_object)
                        }
                    });
                    constant.Summary_Data = summary_array
                    constant.tickers_Data = ticker_array
                })
            });
            return JSON.stringify({ status: 200, data: {}, message: "message" })
        }
        catch (error) {
            console.log("new_save_loan   catch 2", error)
            return JSON.stringify({ status: 400, data: {}, message: error.message })
        }

    },
    async save_Trades_in_mongo_with_json() 
    {
       try {
            var summary_array = new Array();
            MongoClient.connect(process.env.MONGO_URL, async function (err, db) {
            var dbo = db.db(process.env.DB_Name);
            let result_data = await dbo.collection("symbol").find({}).toArray(async function (err, symbols) 
            {
                const requests = symbols.map((tag) =>
                    Utility.Get_Request_By_Axios("https://openapi.lyotrade.com/sapi/v1/trades?symbol=" + tag.symbol, {})
                );
                const api_result = await Promise.all(requests);
                api_result.map((api_item, index) => {
                    if (api_item.status == 200) {
                    let item = symbols[index]
                    let json_api_response = JSON.parse(api_item.data)
                    let apiresponse = json_api_response.data
                    let record = apiresponse.list[0]
                    var object_item = 
                    {
                    symbol                      :   (item.baseAsset +""+item.quoteAsset),
                    trade_id                    :   record.id,
                    base_volume                 :   record.qty,
                    quote_volume                :   (record.qty * record.price),
                    timestamp                   :   record.time,
                    type                        :   record.side,
                    price                       :   record.price,
                    }
                    var main_object = {};
                    main_object[(item.baseAsset + "_" + item.quoteAsset)] = object_item
                    summary_array.push(main_object)
                }
                });

                constant.traders_Data = summary_array
            })
        })
        return JSON.stringify({ status: 200, data: {}, message: "Collection created!" })
          
    } 
    catch (error) 
    {
            console.log("new_save_loan   catch 2",error)
            return JSON.stringify({ status: 400, data: {}, message: error.message })
    }
   
},
}