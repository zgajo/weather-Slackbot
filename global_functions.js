axios = require('axios');

getWeatherForCity = (city)=>{

    return axios.post(`${CONFIG.apiUrl}APPID=${CONFIG.apiKey}&units=metric&q=${city}`)
                .then( data => [null, data.data])
                .catch( err => [err.response]);

}

// Error Web Response
ReEPayload = function(user, err, city){ 
    return {"text": `<@${user}>, I've received an error trying to fetch weather for '${city}' \n error: ${err}`}
}

// Success Web Response
ReSPayload = function(user, city, weather, temp){ 
    return {"text": `<@${user}>, this is current weather for '${city}': \n${weather}  with :thermometer: ${temp} °C`}
};



