const Utility = require('./Utility');
const symbols = require('../models').symbols;
const symbolTicker = require('../models').symbol_ticker;
const coin_market = require('../models').coin_market;
const ticker = require('../models').ticker;
const trades = require('../models').trades;
const fs = require('fs');

module.exports = {
    async get_symbol_data(symbols_response) {
        var arr = []
        let end = -1;

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
    async save_summary() {
        try {
           
            fs.appendFileSync('message.txt','Fetching' + new Date() );
            fs.appendFileSync('message.txt','Fetching the data try \n' );
            const symbols_response = await symbols.findAll()
            const ticker_response = symbols_response
            const trades_response = symbols_response
            fs.appendFileSync('message.txt','Started trades_response' + new Date() );
        
            const tradesresponse = await trades_response.forEach(async function(message){
                var url = "https://openapi.lyotrade.com/sapi/v1/trades?symbol=" +message.symbol
                var api_response =  await Utility.Get_Request_By_Axios(url,{})
                let json_api_response = JSON.parse(api_response.data)
                let apiresponse = json_api_response.data
                let record = apiresponse.list[0]
                if(record != null){
                const symbolsresponse = await trades.create({
                    symbol                      :   (message.baseAsset +""+message.quoteAsset),
                    trade_id                    :   record.id,
                    base_volume                 :   record.qty,
                    quote_volume                :   (record.qty * record.price),
                    timestamp                   :   record.time,
                    type                        :   record.side,
                    price                       :   record.price,
                    status                      :   1,
                }).then(newUser => {
                    fs.appendFileSync('message.txt','Trades Saved' + new Date() );
                    fs.appendFileSync('message.txt',JSON.stringify(newUser)+'\n' );
                    return  { status: 200, data: newUser, message: "Saved Successfully" }
                }).catch(error => {
                        console.log('Insertion OK, username:', error);
                        fs.appendFileSync('message.txt','Trades Error' + new Date() );
                        fs.appendFileSync('message.txt',JSON.stringify(error)+'\n' );
                        return { status: 400, data: {}, message: error.message }
                });
               }
              })
              fs.appendFileSync('message.txt','return try '+new Date()+"\n" );
            return { status: 200, data: {}, message: "Updated Successfully" }
        } catch (error) {
            console.log("new_save_loan   catch 2", error)
            fs.appendFileSync('message.txt','error'+error+new Date()+"\n" );
            return { status: 400, data: {}, message: error.message }
        }
    },

}