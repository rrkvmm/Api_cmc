const Utility = require('../common/Utility');

module.exports = {
    async get_symbol_data(symbols_response)  {
       var arr = []
       let end = -1;
      
             const ress = await symbols_response.forEach(async function(message){
             var symbol =   message.symbol
             var url = "https://openapi.lyotrade.com/sapi/v1/ticker?symbol=" +symbol
             var response =  await Utility.Get_Request_By_Axios(url,{})
             let json_response = JSON.parse(response.data)
             
             arr.push({
                symbol : json_response.data
            }) 
            
                if (end< arr.length)
                console.log("asdsd",end,arr.length)
                end++;
                if (end== arr.length)
                console.log("asdsd",end,arr.length)
            
            
          });
         
         
          return ress;
         

    }
}