module.exports  = async function(req, res, next){

    const city = req.body.text.substring("weather ".length);
    
    const username = req.body.user_name;

    let [err, weather] = await getWeatherForCity(city);

    let payload;

    if(err) payload = ReEPayload(username, err.data.message, city);
    else payload = ReSPayload(username, city, weather.weather[0].main, weather.main.temp);
    
    axios.post(CONFIG.webhook, payload);

    return res.status(200).end();

};