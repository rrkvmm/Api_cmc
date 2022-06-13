const Utility = require('./Utility');
const symbols = require('../models').symbols;
const symbolTicker = require('../models').symbol_ticker;
const coin_market = require('../models').coin_market;
const ticker = require('../models').ticker;
const trades = require('../models').trades;
const fs = require('fs');


module.exports = {
    async get_symbol_data() {
        var arr = []
        let end = -1;
        const symbols_response = await symbols.findAll()
        const ress = await symbols_response.forEach(async function (message) {
            var symbol = message.symbol
            var url = "https://openapi.lyotrade.com/sapi/v1/ticker?symbol=" + symbol
            var response = await Utility.Get_Request_By_Axios(url, {})
            let json_response = JSON.parse(response.data)

            arr.push({
                symbol: json_response.data
            })

            if (end < arr.length)
                console.log("asdsd", end, arr.length)
            end++;
            if (end == arr.length)
                console.log("asdsd", end, arr.length)

        });
        return ress;
    },
    async save_data_summary() {
      
        try {
            
            const symbols_response = await symbols.findAll()
            const ress = await symbols_response.forEach(async function (message) {
                var ticker_url = "https://openapi.lyotrade.com/sapi/v1/ticker?symbol=" + message.symbol
                var api_response = await Utility.Get_Request_By_Axios(ticker_url, {})
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
            })
             
            return { status: 200, data: {}, message: "Working " }
        }
        catch (error) {
            console.log("new_save_loan   catch 2", error)
          
            return { status: 400, data: {}, message: error.message }
        }
       
    },
    async save_data_trades() {
        try {
           
            const symbols_response = await symbols.findAll()
            const tradesresponse = await symbols_response.forEach(async function (message) {
                var url = "https://openapi.lyotrade.com/sapi/v1/trades?symbol=" + message.symbol
                var api_response = await Utility.Get_Request_By_Axios(url, {})
                let json_api_response = JSON.parse(api_response.data)
                let apiresponse = json_api_response.data
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

       
           

            return { status: 200, data: {}, message: "Working " }
        }
        catch (error) {
            console.log("new_save_loan   catch 2", error)
           
            return { status: 400, data: {}, message: error.message }
        }
    },
    async save_data_ticker() {
        try {
           
            const symbols_response = await symbols.findAll()
            const tickerresponse = await symbols_response.forEach(async function (message) {
                var ticker_url = "https://openapi.lyotrade.com/sapi/v1/ticker?symbol=" + message.symbol
                var api_response = await Utility.Get_Request_By_Axios(ticker_url, {})
                let json_api_response = JSON.parse(api_response.data)
                let apiresponse = json_api_response.data
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
                }
               
                return { status: 200, data: {}, message: "Updated Successfully" }
            })

       
           

            return { status: 200, data: {}, message: "Working " }
        }
        catch (error) {
            console.log("new_save_loan   catch 2", error)
            
            return { status: 400, data: {}, message: error.message }
        }
    },
    async save_summary() {
        try {
             
            
            const symbols_response = await symbols.findAll()
            const ticker_response = symbols_response
            const trades_response = symbols_response
           

            const ress = await symbols_response.forEach(async function (message) {
                var ticker_url = "https://openapi.lyotrade.com/sapi/v1/ticker?symbol=" + message.symbol
                var api_response = await Utility.Get_Request_By_Axios(ticker_url, {})
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
            })

            const tradesresponse = await trades_response.forEach(async function (message) {
                var url = "https://openapi.lyotrade.com/sapi/v1/trades?symbol=" + message.symbol
                var api_response = await Utility.Get_Request_By_Axios(url, {})
                let json_api_response = JSON.parse(api_response.data)
                let apiresponse = json_api_response.data
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
            const tickerresponse = await ticker_response.forEach(async function (message) {
                var ticker_url = "https://openapi.lyotrade.com/sapi/v1/ticker?symbol=" + message.symbol
                var api_response = await Utility.Get_Request_By_Axios(ticker_url, {})
                let json_api_response = JSON.parse(api_response.data)
                let apiresponse = json_api_response.data
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
                }
              
                return { status: 200, data: {}, message: "Updated Successfully" }
            })

            return { status: 200, data: {}, message: "Working " }
        }
        catch (error) {
            console.log("new_save_loan   catch 2", error)
           
            return { status: 400, data: {}, message: error.message }
        }
    },

}