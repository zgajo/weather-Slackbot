const { RtmClient, CLIENT_EVENTS, RTM_EVENTS, RTM_MESSAGE_SUBTYPES, WebClient } = require('@slack/client');
// SNIP: the initialization code shown above is skipped for brevity

var rtm = new RtmClient(CONFIG.bot);
rtm.start();

// to store our data
const appData = {};

// reading city
let getCityFromSentence = function(sentence){
    
    let weatherSentence = ['Weather in ', 'weather in ', 'weather ', ' weather'];
    let city; 

    for(let i = 0; i < weatherSentence.length; i++){
        
        if(i == 3){
            if(sentence.indexOf(weatherSentence[i]) > -1){
                city = sentence.substring(0, weatherSentence[i].length);
                break;
            }
        }
        else{
            if(sentence.indexOf(weatherSentence[i]) > -1){
                city = sentence.substring(weatherSentence[i].length);
                break;
            }
        }
    }

    return city;

}


// on conection
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
    for (const c of rtmStartData.channels) {
        if (c.is_member && c.name ==='weather') { 
            appData.channel = c.id 
        }
    }

    appData.selfId = rtmStartData.self.id;
    appData.selfName = rtmStartData.self.name;

    console.log(`Logged in as ${appData.selfName} - ${appData.selfId} of team ${rtmStartData.team.name}`);
});



rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
    rtm.sendMessage("Hello!", appData.channel);
});




// Receiving messages
rtm.on(RTM_EVENTS.MESSAGE, async function(message) {

      // Skip messages that are from a bot or my own user ID
    if ( (message.subtype && message.subtype === 'bot_message') || (!message.subtype && message.user === appData.selfId) ) {
        return;
    }

    // if our bot is called
    if(message.text.indexOf(`<@${appData.selfId}>`) == 0){

        let botId = `<@${appData.selfId}> `;
        let sentence = message.text.substring(botId.length);

        let city = getCityFromSentence(sentence);

        if(!city) rtm.sendMessage(`Hi <@${message.user}>. I can't understand those words!`, appData.channel);
        else{

            let [err, weather] = await getWeatherForCity(city);

            if(err){
                rtm.sendMessage(`<@${message.user}>, I've received an error trying to fetch weather for '${city}' \n  error: ${err.data.message}`, appData.channel);
            }
            else{
                rtm.sendMessage(`<@${message.user}>, this is current weather for '${city}': \n${weather.weather[0].main}  with :thermometer: ${weather.main.temp} °C`, appData.channel);
            }
           
        }
        
    }

});
