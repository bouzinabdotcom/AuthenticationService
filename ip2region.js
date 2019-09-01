const axios = require('axios');
const  ip_addr = require('ip-address');

module.exports.ip2region = async function (ipaddress) {
    const ip2locservicehost = config.get('ip2loc_service_host');
    try{
        const res = await axios.get(ip2locservicehost + ipaddress);
        return res.data.region;
    }
    catch(err) {
        //log problem
        return ;

    }
    
};

module.exports.ipFormat4 = function(ip) {
    const address = new ip_addr.Address6(ip);
    return address.to4().address;
    
}