module.exports  = async function(req, res, next){

    const   city = req.body.text,
            username = req.body.user_name;

    let [err, weather] = await getWeatherForCity(city);

    let bodyPayload;

    if(err) bodyPayload = ReEPayload(username, err.data.message, city);
    else bodyPayload = ReSPayload(username, city, weather.weather[0].main, weather.main.temp);

    if(username !== 'slackbot'){
        return res.status(200).json(bodyPayload);
    }
    else{
        return res.status(200).end();
    }

};