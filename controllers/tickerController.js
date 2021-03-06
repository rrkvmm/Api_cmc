const symbols = require('../models').symbols;
const symbolTicker = require('../models').symbol_ticker;
const Utility = require('../common/Utility');
const commonapi = require('../common/common_api');
const axios = require('axios');
const { Op, json } = require("sequelize");
const conn = require('../config/conn');
const WebSocket = require('ws').WebSocket;
const zlib = require('zlib');
module.exports =
{
     
  
    async get_symbols(req, res) {
        try {
            var response = await Utility.Get_Request_By_Axios("https://openapi.lyotrade.com/sapi/v1/symbols",{})
            let json_response = JSON.parse(response.data)
            let symbols_response = await symbols.bulkCreate(json_response.data.symbols,{ 
                updateOnDuplicate: ["symbol", "quantityPrecision", "pricePrecision", "baseAsset", "quoteAsset"],
                
            })
            .then((response) =>
            res.json({ status: 200, data:response, message: "Symbols Saved" })
            )
            .catch((error) => 
            
            res.json({ status: 400, data:{}, message:error.message })
            )
           
        } catch (error) {
            console.log("new_save_loan   catch 2",error)
            res.json({ status: 400, data: {}, message: error.message })
        }
    },
    async save_summary(req, res) {
        try {

            // wss://wspool.hiotc.pro/kline-api/ws
            const symbols_response = await symbols.findAll()
            const ress = await symbols_response.forEach(async function(message){
            var url = "https://openapi.lyotrade.com/sapi/v1/ticker?symbol=" +message.symbol
            var api_response =  await Utility.Get_Request_By_Axios(url,{})
            let json_api_response = JSON.parse(api_response.data)
            let apiresponse = json_api_response.data
            apiresponse["symbol"] =  message.symbol
            apiresponse["status"] =  1
            // var arr = [apiresponse]
            await symbolTicker.update({ status: 0  }, { where: { trading_pairs : (message.baseAsset +"_"+message.quoteAsset)  }})
            const symbolsresponse = await symbolTicker.create({
                trading_pairs             :   (message.baseAsset +"_"+message.quoteAsset),
                base_currency             :   message.baseAsset ,
                quote_currency            :   message.quoteAsset,
                last_price                :   apiresponse.last,
                lowest_ask                :   apiresponse.low,
                price_change_percent_24h  :   apiresponse.rose,
                base_volume               :   apiresponse.vol,
                highest_bid               :   apiresponse.buy,
                highest_price_24h         :   apiresponse.high,
                lowest_price_24h          :   apiresponse.low,
                status                    :   1,
            }).then(newUser => {
                return  { status: 200, data: newUser, message: "Saved Successfully" }
            }).catch(error => {
                    console.log('Insertion OK, username:', error);
                    return { status: 400, data: {}, message: error.message }
            });
      
            console.log("response",symbolsresponse)
            })
          res.json({ status: 200, data: {}, message: "Updated Successfully" })
    } catch (error) {
            console.log("new_save_loan   catch 2",error)
            res.json({ status: 400, data: {}, message: error.message })
        }
    },
    async get_summary(req, res) {
        try {
            conn.pool.query('SELECT  json_object_agg(t1.trading_pairs, (t1.* ))   FROM symbol_tickers t1  WHERE t1.status = 1', (error, results) => {
                if (error) {
                    // res.status(400).json("Data could not found")
                    res.json({ status: 400, message: "Data could not found" ,data: {}})
                }else{
                    res.json({ status: 200, message: "Success" ,data: results.rows[0].json_object_agg})
                    // res.status(200).json(results.rows[0].json_object_agg)
                }
               
               
              })
          
            
            
     
    } catch (error) {
            console.log("new_save_loan   catch 2",error)
            res.send({ status: 400, data: {}, message: error.message })
        }
    },
    async get_web_socket(req, res) {
        try {
            const symbols_response = await symbols.findAll()
            const ws = new WebSocket('wss://wspool.hiotc.pro/kline-api/ws');
            
            ws.on('open', function open() { 
                let sendData = JSON.stringify({
                    "event":"sub",
                    "params":{
                        "channel":"market_btcusdt_ticker", // $symbol E.g. btcusdt 
                        "cb_id":"1" // Business ID is not required
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
            console.log("new_save_loan   catch 2",error)
            res.json({ status: 400, data: {}, message: error.message })
        }
    },
}