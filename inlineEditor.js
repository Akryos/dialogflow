'use strict';
const axios = require('axios');
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    /*
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    */

    function welcome(agent) {
        agent.add(`Welcome to my agent!`);
    }
 
    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function showAllAvailable(agent) {
        return axios.get('https://api.datamuse.com/words?rel_rhy=teacher')
        .then((result) => {
            let output = '';
          
            result.data.map(wordObj => {
                output += (wordObj.word + "\n");
            });
          
            agent.add(output);
        });
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('showAllAvailable', showAllAvailable);
    agent.handleRequest(intentMap);
});
