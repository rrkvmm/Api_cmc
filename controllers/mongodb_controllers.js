const conn = require('../config/conn');
var MongoClient = require('mongodb').MongoClient;
const mongodb = require("mongodb").schema;

const Utility = require('../common/Utility');
const { save_summary } = require('./symbol_controllers');
const constant = require('../common/constant');
module.exports =
{

    async create_collection_in_mongo(req, res) {
        try {

            MongoClient.connect(process.env.MONGO_URL, function (err, db) {
                var dbo = db.db(req.body.dbname);
                dbo.createCollection(req.body.name, function (err, response) {
                    if (err) {

                        res.json({ status: 400, data: {}, message: err })
                    }
                    else {
                        db.close();
                        res.json({ status: 200, data: {}, message: "Collection created!" })
                    }
                });
            });
        } catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.json({ status: 400, data: {}, message: error.message })
        }
    },
    async create_symbol_in_mongo(req, res) {
        try {

            MongoClient.connect(process.env.MONGO_URL, async function (err, db) {
                if (err) throw err;

                var dbo = db.db(process.env.DB_Name);
                var response = await Utility.Get_Request_By_Axios("https://openapi.lyotrade.com/sapi/v1/symbols", {})
                let json_response = JSON.parse(response.data)
                json_response.data.symbols.forEach(async function (item) {
                    var base_Asset_query = { "symbol": item.baseAsset }
                    var quote_Asset_query = { "symbol": item.quoteAsset }
                    let base_Asset_coin = await dbo.collection("coin_market").findOne(base_Asset_query)
                    let quote_Asset_coin = await dbo.collection("coin_market").findOne(quote_Asset_query)
                    if (base_Asset_coin != null && quote_Asset_coin != null) {
                        item["quote_asset_id"] = quote_Asset_coin.id
                        item["base_asset_id"] = base_Asset_coin.id
                        let symbol_insertaion = await dbo.collection("symbol").insertOne(item)


                    }



                })
            });

            res.json({ status: 200, data: {}, message: "Collection created!" })
        }
        catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.json({ status: 400, data: {}, message: error.message })
        }
    },
    async create_coin_market_in_mongo(req, res) {
        try {

            var url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?CMC_PRO_API_KEY=UNIFIED-CRYPTOASSET-INDEX&listing_status=active"
            var api_response = await Utility.Get_Request_By_Axios(url, {})
            let json_api_response = JSON.parse(api_response.data)
            let apiresponse = json_api_response.data
            MongoClient.connect(process.env.MONGO_URL, function (err, db) {
                if (err) throw err;

                var dbo = db.db(process.env.DB_Name);

                dbo.collection("coin_market").insertMany(apiresponse.data, function (err, response) {
                    if (err) {

                        res.json({ status: 400, data: {}, message: err })
                    }
                    else {
                        db.close();
                        res.json({ status: 200, data: response, message: "Collection created!" })
                    }
                });
            });

        }
        catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.json({ status: 400, data: {}, message: error.message })
        }
    },
    async save_summary_in_mongo(req, res) {
        try {
            MongoClient.connect(process.env.MONGO_URL, async function (err, db) {
                if (err) throw err;
                var dbo = db.db(process.env.DB_Name);
                let result_data = await dbo.collection("symbol").find({}).toArray(async function (err, result) {
                    if (err) {
                        // res.json({ status: 400, data: {}, message: err })
                        return []
                    }
                    else {
                        result.forEach(async function (item) {
                            var url = "https://openapi.lyotrade.com/sapi/v1/ticker?symbol=" + item.symbol
                            var api_response = await Utility.Get_Request_By_Axios(url, {})
                            let json_api_response = JSON.parse(api_response.data)
                            let apiresponse = json_api_response.data
                            var myobj =
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


                            var main_data = {};
                            main_data['pair_name'] = (item.baseAsset + "_" + item.quoteAsset)
                            main_data[(item.baseAsset + "_" + item.quoteAsset)] = myobj
                            var newvalues = { $set: main_data };
                            var query = {};
                            query['pair_name'] = (item.baseAsset + "_" + item.quoteAsset)

                            dbo.collection("summary").findOne(query, function (err, res) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    console.log("result", res);
                                    if (res == null) {
                                        dbo.collection("summary").insertOne(main_data, function (err, summary_Response) {
                                            if (err) {
                                                console.log(err)

                                            }
                                            else {

                                                console.log(summary_Response)

                                            }
                                        })
                                    }
                                    else {
                                        dbo.collection("customers").updateOne(query, newvalues, function (err, res) {
                                            if (err) throw err;
                                            console.log("1 document updated");

                                        });
                                    }
                                }


                            });


                        })

                        return result
                    }
                });

                res.json({ status: 200, data: result_data, message: "Collection created!" })
            });

        }
        catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.json({ status: 400, data: {}, message: error.message })
        }
    },
    async save_tickers_in_mongo(req, res) {
        try {
            MongoClient.connect(process.env.MONGO_URL, async function (err, db) {
                if (err) throw err;
                var dbo = db.db(process.env.DB_Name);
                let result_data = await dbo.collection("symbol").find({}).toArray(async function (err, result) {
                    if (err) {
                        // res.json({ status: 400, data: {}, message: err })
                        return []
                    }
                    else {
                        result.forEach(async function (item) {


                            var url = "https://openapi.lyotrade.com/sapi/v1/ticker?symbol=" + item.symbol
                            var api_response = await Utility.Get_Request_By_Axios(url, {})
                            let json_api_response = JSON.parse(api_response.data)
                            let apiresponse = json_api_response.data
                            var base_Asset_query = { "symbol": item.baseAsset }
                            var quote_Asset_query = { "symbol": item.quoteAsset }
                            console.log("save_tickers_in_mongo   ", base_Asset_query)
                            console.log("save_tickers_in_mongo   ", quote_Asset_query)
                            let base_Asset_coin = await dbo.collection("coin_market").findOne(base_Asset_query)
                            let quote_Asset_coin = await dbo.collection("coin_market").findOne(quote_Asset_query)
                            if (quote_Asset_coin != null && base_Asset_coin != null) {
                                var myobj = {
                                    symbol: (item.baseAsset + "_" + item.quoteAsset),
                                    base_id: base_Asset_coin.coin_id,
                                    quote_id: quote_Asset_coin.coin_id,
                                    last_price: apiresponse.last,
                                    base_volume: apiresponse.vol,
                                    quote_volume: (apiresponse.last * apiresponse.vol),
                                    isFrozen: 1,
                                }

                                var main_data = {};
                                main_data['pair_name'] = (item.baseAsset + "_" + item.quoteAsset)
                                main_data[(item.baseAsset + "_" + item.quoteAsset)] = myobj
                                var newvalues = { $set: main_data };
                                var query = {};
                                query['pair_name'] = (item.baseAsset + "_" + item.quoteAsset)
                                let tickers_query = await dbo.collection("tickers").findOne(query)
                                if (tickers_query == null) {
                                    let tickers_save = await dbo.collection("tickers").insertOne(main_data)
                                    console.log("tickers_save", tickers_save)
                                }
                                else {
                                    let tickers_update = await dbo.collection("tickers").updateOne(query, newvalues)
                                    console.log("tickers_update", tickers_update)
                                }
                            }

                        })
                        return result
                    }
                });
                // db.close();
                res.json({ status: 200, data: result_data, message: "Collection created!" })
            });

        }
        catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.json({ status: 400, data: {}, message: error.message })
        }
    },
    async get_summary(req, res) {
        try {
            MongoClient.connect(process.env.MONGO_URL, function (err, db) {
                if (err) {
                    res.send({ status: 400, data: {}, message: "error" })
                }
                else {
                    var dbo = db.db(process.env.DB_Name);
                    dbo.collection("summary").find({}).toArray(function (err, result) {
                        if (err) { res.send({ status: 400, data: {}, message: "error" }) }

                        db.close();
                        res.send({ status: 200, data: result, message: "success" })

                    });
                }
            });
        } catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.send({ status: 400, data: {}, message: error.message })
        }
    },
    async get_tickers(req, res) {
        try {
            MongoClient.connect(process.env.MONGO_URL, function (err, db) {
                if (err) {
                    res.send({ status: 400, data: {}, message: "error" })
                }
                else {
                    var dbo = db.db(process.env.DB_Name);
                    dbo.collection("tickers").find({}).toArray(function (err, result) {
                        if (err) { res.send({ status: 400, data: {}, message: "error" }) }

                        db.close();
                        res.send({ status: 200, data: result, message: "success" })

                    });
                }
            });
        } catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.send({ status: 400, data: {}, message: error.message })
        }
    },
    async save_summary_in_mongo_with_json(req, res) {
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
                    });
                    constant.Summary_Data = summary_array
                    constant.tickers_Data = ticker_array



                })
            });
            res.json({ status: 200, data: {}, message: "message" })
        }
        catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.json({ status: 400, data: {}, message: error.message })
        }

    },
    async save_tickers_in_mongo_with_json(req, res) {
        try {
            var summary_array = new Array();
            MongoClient.connect(process.env.MONGO_URL, async function (err, db) {
            var dbo = db.db(process.env.DB_Name);
            let result_data = await dbo.collection("symbol").find({}).toArray(async function (err, symbols) {

                const requests = symbols.map((tag) =>
                    Utility.Get_Request_By_Axios("https://openapi.lyotrade.com/sapi/v1/ticker?symbol=" + tag.symbol, {})
                );
                const api_result = await Promise.all(requests);
                api_result.map((api_item, index) => {
                    let item = symbols[index]
                    let json_api_response = JSON.parse(api_item.data)
                    let apiresponse = json_api_response.data
                    var object_item = {
                        symbol: (item.baseAsset + "_" + item.quoteAsset),
                        base_id: item.base_asset_id,
                        quote_id: item.quote_asset_id,
                        last_price: apiresponse.last,
                        base_volume: apiresponse.vol,
                        quote_volume: (apiresponse.last * apiresponse.vol),
                        isFrozen: 1,
                    }

                    var main_object = {};
                    main_object[(item.baseAsset + "_" + item.quoteAsset)] = object_item
                    summary_array.push(main_object)
                    console.log("main_object",main_object)   
                });

                constant.tickers_Data = summary_array
            })
        })
            res.json({ status: 200, data: {}, message: "Collection created!" })


        }
        catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.json({ status: 400, data: {}, message: error.message })
        }
    },
    async save_Trades_in_mongo_with_json(req, res) 
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
                    console.log("main_object",main_object)   
                });

                constant.traders_Data = summary_array
            })
        })
            res.json({ status: 200, data: {}, message: "Collection created!" })
          
    } 
    catch (error) 
    {
            console.log("new_save_loan   catch 2",error)
            res.send({ status: 400, data: {}, message: error.message })
    }
    },
    async get_asset(req, res) {
        try {
            MongoClient.connect(process.env.MONGO_URL, function (err, db) {
                if (err) {
                    res.send({ status: 400, data: {}, message: err })
                }
                else {
                    var dbo = db.db(process.env.DB_Name);
                    dbo.collection("symbol").find({}).toArray(function (err, result) {
                        if (err) { res.send({ status: 401, data: {}, message: err }) }

                        
                        res.send({ status: 200, data: result, message: "success" })

                    });
                }
            });
        } catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.send({ status: 400, data: {}, message: error.message })
        }
    },
    async get_summary_with_json(req, res) {
        try {
            res.send({ status: 200, data: constant.fetch_Summary_Data, message: "success" })
        } catch (error) {
            console.log("get_summary_with_json   catch 2", error)
            res.send({ status: 400, data: {}, message: error.message })
        }
    },
    async get_tickers_with_json(req, res) {
        try 
        {
            res.send({ status: 200, data: constant.fetch_tickers_Data, message: "success" })
        } catch (error) {
            console.log("get_summary_with_json   catch 2", error)
            res.send({ status: 400, data: {}, message: error.message })
        }
    },
    async get_traders_with_json(req, res) {
        try 
        {
            res.send({ status: 200, data: constant.fetch_traders_data, message: "success" })
        } catch (error) {
            console.log("get_summary_with_json   catch 2", error)
            res.send({ status: 400, data: {}, message: error.message })
        }
    },
    async get_order_book(req, res) {
        try {
            var symbol = req.query.symbol;
            var query_par = "https://openapi.lyotrade.com/sapi/v1/depth?symbol="+symbol
            var response = await Utility.Get_Request_By_Axios(query_par,{})
            let json_response = JSON.parse(response.data)
            json_response.data["timestamp"] = Date.now(); 
            res.send(json_response.data)
    } catch (error) {
            console.log("get_trades   catch 2",error)
            res.send({ status: 400, data: {}, message: error.message })
        }
    },
    
}
