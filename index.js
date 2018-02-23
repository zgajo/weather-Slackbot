require('./config');  //instantiate global CONFIG object

require('./global_functions');  //instantiate global functions

require('./bot/slackbot') // Bot which is connected to workspace

const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');

const app = new express();

const SlashController = require('./bot/slash_commands');
const WebhooksConstroller = require('./bot/webhooks');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// for  slack slash commands (waiting for /weather trigger)
app.get('/', (req, res)=>{
    res.send("Just a little bot")
});

// for  slack slash commands (waiting for /weather trigger)
app.post('/slash_weather', SlashController);

// webhook trigger which listens for weather as first word 
app.post("/webhooks", WebhooksConstroller);


app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server listening")
}) 