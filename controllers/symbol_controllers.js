const symbols = require('../models').symbols;
const symbolTicker = require('../models').symbol_ticker;
const symbol_ticker = require('../models').symbol_ticker;
const coin_market = require('../models').coin_market;
const ticker = require('../models').ticker;
const trades = require('../models').trades;
const Utility = require('../common/Utility');
const commonapi = require('../common/common_api');
const axios = require('axios');
const { Op, json } = require("sequelize");
const conn = require('../config/conn');
const WebSocket = require('ws').WebSocket;
const zlib = require('zlib');
const { Console } = require('console');
var moment = require('moment')
module.exports =
{

    async save_symbols(req, res) {
        try {
            var response = await Utility.Get_Request_By_Axios("https://openapi.lyotrade.com/sapi/v1/symbols", {})
            let json_response = JSON.parse(response.data)
            let symbols_response = await symbols.bulkCreate(json_response.data.symbols, {
                updateOnDuplicate: ["symbol", "quantityPrecision", "pricePrecision", "baseAsset", "quoteAsset"],

            })
                .then((response) =>
                    res.json({ status: 200, data: response, message: "Symbols Saved" })
                )
                .catch((error) =>

                    res.json({ status: 400, data: {}, message: error.message })
                )

        } catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.json({ status: 400, data: {}, message: error.message })
        }
    },
    async get_symbols(req, res) {
        try {
            var response = await Utility.Get_Request_By_Axios("https://openapi.lyotrade.com/sapi/v1/symbols", {})
            let json_response = JSON.parse(response.data)
            let symbols_response = await symbols.bulkCreate(json_response.data.symbols, {
                updateOnDuplicate: ["symbol", "quantityPrecision", "pricePrecision", "baseAsset", "quoteAsset"],

            })
                .then((response) =>
                    res.json({ status: 200, data: response, message: "Symbols Saved" })
                )
                .catch((error) =>

                    res.json({ status: 400, data: {}, message: error.message })
                )

        } catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.json({ status: 400, data: {}, message: error.message })
        }
    },
    async save_summary(req, res) {
        try {
            var startDate = Date.now()
            const symbols_response = await symbols.findAll()
            const ress = await symbols_response.forEach(async function (message) {
                var url = "https://openapi.lyotrade.com/sapi/v1/ticker?symbol=" + message.symbol
                var api_response = await Utility.Get_Request_By_Axios(url, {})
                let json_api_response = JSON.parse(api_response.data)
                let apiresponse = json_api_response.data
                apiresponse["symbol"] = message.symbol
                apiresponse["status"] = 1
                // var arr = [apiresponse]
                await symbolTicker.update({ status: 0 }, { where: { trading_pairs: (message.baseAsset + "_" + message.quoteAsset) } })
                const symbolsresponse = await symbolTicker.create({
                    trading_pairs: (message.baseAsset + "_" + message.quoteAsset),
                    base_currency: message.baseAsset,
                    quote_currency: message.quoteAsset,
                    last_price: apiresponse.last,
                    lowest_ask: apiresponse.low,
                    price_change_percent_24h: apiresponse.rose,
                    base_volume: apiresponse.vol,
                    highest_bid: apiresponse.buy,
                    highest_price_24h: apiresponse.high,
                    lowest_price_24h: apiresponse.low,
                    status: 1,
                }).then(newUser => {
                    return { status: 200, data: newUser, message: "Saved Successfully" }
                }).catch(error => {
                    console.log('Insertion OK, username:', error);
                    return { status: 400, data: {}, message: error.message }
                });

                var endDate = Date.now()

                var secondsDiff = endDate - startDate

                console.log("response", secondsDiff)

                startDate = Date.now()

            })
            res.json({ status: 200, data: {}, message: "Updated Successfully" })
        } catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.json({ status: 400, data: {}, message: error.message })
        }
    },
    async get_summary(req, res) {
        try {
            conn.pool.query('SELECT  json_object_agg(t1.trading_pairs, (t1.* ))   FROM symbol_tickers t1  ', (error, results) => {
                if (error) {
                    // res.status(400).json("Data could not found")
                    res.json({ status: 400, message: "Data could not found", data: {} })
                } else {
                    res.json({ status: 200, message: "Success", data: results.rows[0].json_object_agg })
                    // res.status(200).json(results.rows[0].json_object_agg)
                }


            })

        } catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.send({ status: 400, data: {}, message: error.message })
        }
    },
    async get_tickers(req, res) {
        try {
            const queryObject = url.parse(req.url, true).query;
            console.log("queryObject",queryObject)
            console.log("queryObject",queryObject.symbol)
            console.log("queryObject",Object.keys(queryObject).indexOf("symbol"))
            var sql_query = 'SELECT  json_object_agg(t1.symbol, (t1.* ))   FROM tickers t1  '
            if(queryObject == undefined){
                sql_query = 'SELECT  json_object_agg(t1.symbol, (t1.* ))   FROM tickers t1  '
            }
            else if(Object.keys(queryObject).indexOf("symbol") != -1 ){
                 if(queryObject.symbol == "")
                 {
                    return res.json({ status: 400, message: "Invalid symbol" ,data: null})
                 }

                sql_query = "SELECT  json_object_agg(t1.symbol, (t1.* ))   FROM tickers t1  WHERE t1.symbol ='"+queryObject.symbol+"'"
            }

            conn.pool.query(sql_query, (error, results) => {
                if (error) {
                    console.log("error",error)
                    res.json({ status: 400, message: "Data could not found" ,data:sql_query})
                }else{
                    res.json({ status: 200, message: "Success" ,data: results.rows[0].json_object_agg})
                    // res.status(200).json(results.rows[0].json_object_agg)
                }
               
               
              })

        } catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.send({ status: 400, data: {}, message: error.message })
        }
    },
    async get_asset(req, res) {
        try {
            conn.pool.query('SELECT  json_object_agg(t1.symbol, (t1.* ))   FROM symbols t1', (error, results) => {
                if (error) {
                    console.log("error", error)
                    // res.status(400).json("Data could not found")
                    res.json({ status: 400, message: "Data could not found", data: {} })
                } else {
                    res.json({ status: 200, message: "Success", data: results.rows[0].json_object_agg })
                    // res.status(200).json(results.rows[0].json_object_agg)
                }


            })

        } catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.send({ status: 400, data: {}, message: error.message })
        }
    },
    async save_Tickers(req, res) {
        try {
            const symbols_response = await symbols.findAll()
            const ress = await symbols_response.forEach(async function (message) {
                var url = "https://openapi.lyotrade.com/sapi/v1/ticker?symbol=" + message.symbol
                var api_response = await Utility.Get_Request_By_Axios(url, {})
                let json_api_response = JSON.parse(api_response.data)
                let apiresponse = json_api_response.data
                // apiresponse["symbol"] =  message.symbol
                // apiresponse["status"] =  1
                // var arr = [apiresponse]
                await ticker.update({ status: 0 }, { where: { symbol: (message.baseAsset + "_" + message.quoteAsset) } })
                // (message.baseAsset +"_"+message.quoteAsset),
                const base_Asset_coin = await coin_market.findOne({ where: { symbol: message.baseAsset } })
                console.log("base_Asset_coin", message.baseAsset + "_" + message.quoteAsset, base_Asset_coin)
                const quote_Asset_coin = await coin_market.findOne({ where: { symbol: message.quoteAsset } })
                console.log("quote_Asset_coin", message.baseAsset + "_" + message.quoteAsset, quote_Asset_coin)
                if (base_Asset_coin != null && quote_Asset_coin != null) {
                    const symbolsresponse = await ticker.create({
                        symbol: (message.baseAsset + "_" + message.quoteAsset),
                        base_id: base_Asset_coin.coin_id,
                        quote_id: quote_Asset_coin.coin_id,
                        last_price: apiresponse.last,
                        base_volume: apiresponse.vol,
                        quote_volume: (apiresponse.last * apiresponse.vol),
                        isFrozen: 1,
                        status: 1,

                    }).then(newUser => {
                        return { status: 200, data: newUser, message: "Saved Successfully" }
                    }).catch(error => {
                        console.log('Insertion OK, username:', error);
                        return { status: 400, data: {}, message: error.message }
                    });
                    console.log("response", symbolsresponse)
                }



            })
            res.json({ status: 200, data: {}, message: "Updated Successfully" })

        } catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.send({ status: 400, data: {}, message: error.message })
        }
    },
    async get_web_socket(req, res) {
        try {
            const symbols_response = await symbols.findAll()
            const ws = new WebSocket('wss://wspool.hiotc.pro/kline-api/ws');

            ws.on('open', function open() {
                let sendData = JSON.stringify({
                    "event": "sub",
                    "params": {
                        "channel": "market_btcusdt_ticker", // $symbol E.g. btcusdt 
                        "cb_id": "1" // Business ID is not required
                    }
                });
                ws.send(sendData);
            });
            ws.on('message', function message(data) {
                zlib.unzip(data, (err, buffer) => {
                    if (err) {
                        console.error('An error occurred:', err);
                        process.exitCode = 1;
                    }
                    console.log(buffer.toString());
                    // res.json({ status: 200, data: buffer.toString(), message: "" })
                });
            });

        } catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.json({ status: 400, data: {}, message: error.message })
        }
    },
    async get_coin_data(req, res) {
        try {

            // wss://wspool.hiotc.pro/kline-api/ws
            // const symbols_response = await symbols.findAll()
            var url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?CMC_PRO_API_KEY=UNIFIED-CRYPTOASSET-INDEX&listing_status=active"
            var api_response = await Utility.Get_Request_By_Axios(url, {})
            let json_api_response = JSON.parse(api_response.data)
            let apiresponse = json_api_response.data
            const ress = await apiresponse.data.forEach(async function (message) {
                console.log("message", message)

                const symbolsresponse = await coin_market.create({
                    coin_id: message.id,
                    name: message.name,
                    symbol: message.symbol,
                    slug: message.slug,

                }).then(newUser => {
                    console.log("message", newUser)
                    return { status: 200, data: newUser, message: "Saved Successfully" }
                }).catch(error => {
                    console.log("message", error)
                    console.log('Insertion OK, username:', error);
                    return { status: 400, data: {}, message: error.message }
                });

            })
            res.json({ status: 200, data: apiresponse, message: "Updated Successfully" })
        } catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.json({ status: 400, data: {}, message: error.message })
        }
    },
    async save_Trades(req, res) {
        try {
            const symbols_response = await symbols.findAll()
            const ress = await symbols_response.forEach(async function (message) {
                var url = "https://openapi.lyotrade.com/sapi/v1/trades?symbol=" + message.symbol
                var api_response = await Utility.Get_Request_By_Axios(url, {})
                let json_api_response = JSON.parse(api_response.data)
                let apiresponse = json_api_response.data
                // console.log(Object.keys(apiresponse).length)
                // console.log(Object.keys(Object.keys(apiresponse)[0]))
                let record = apiresponse.list[0]
                if (record != null) {
                    const symbolsresponse = await trades.create({
                        symbol: (message.baseAsset + "" + message.quoteAsset),
                        trade_id: record.id,
                        base_volume: record.qty,
                        quote_volume: (record.qty * record.price),
                        timestamp: record.time,
                        type: record.side,
                        price: record.price,
                        status: 1,
                    }).then(newUser => {
                        return { status: 200, data: newUser, message: "Saved Successfully" }
                    }).catch(error => {
                        console.log('Insertion OK, username:', error);
                        return { status: 400, data: {}, message: error.message }
                    });
                }
            })
            res.json({ status: 200, data: {}, message: "Updated Successfully" })

        } catch (error) {
            console.log("new_save_loan   catch 2", error)
            res.send({ status: 400, data: {}, message: error.message })
        }
    },
    async get_trades(req, res) {
        try {
            conn.pool.query('SELECT  json_object_agg(t2.symbol, (t1.*)) FROM symbols t2 LEFT JOIN  trades t1 ON      t2.symbol = lower(t1.symbol)', (error, results) => {
                if (error) {
                    console.log("error", error)
                    // res.status(400).json("Data could not found")
                    res.json({ status: 400, message: "Data could not found", data: {} })
                } else {
                    res.json({ status: 200, message: "Success", data: results.rows[0].json_object_agg })
                    // res.status(200).json(results.rows[0].json_object_agg)
                }


            })

        } catch (error) {
            console.log("get_trades   catch 2", error)
            res.send({ status: 400, data: {}, message: error.message })
        }
    },
    async get_order_book(req, res) {
        try {
            var symbol = req.query.symbol;
            var query_par = "https://openapi.lyotrade.com/sapi/v1/depth?symbol=" + symbol
            var response = await Utility.Get_Request_By_Axios(query_par, {})
            let json_response = JSON.parse(response.data)
            json_response.data["timestamp"] = Date.now();
            res.send(json_response.data)
        } catch (error) {
            console.log("get_trades   catch 2", error)
            res.send({ status: 400, data: {}, message: error.message })
        }
    },
}