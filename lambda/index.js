const Alexa = require('ask-sdk-core');
const Util = require('./util.js');

var https = require('https');

const PlayHandler = {
	canHandle(handlerInput)
	{
		return (
			handlerInput.requestEnvelope.request.type === 'LaunchRequest' ||
			(
				handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
				handlerInput.requestEnvelope.request.intent.name === 'Play'
			) ||
			(
				handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
				handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ResumeIntent'
			)
		);
	},
	handle(handlerInput)
	{
	    
	    const speechText = 'Tocando JB Classic.';
	    
	    return handlerInput.responseBuilder
			.speak(speechText)
			.addDirective({
			  "type": "AudioPlayer.Play",
              "playBehavior": "REPLACE_ALL",
              "audioItem": {
                "stream": {
                  //"url": "https://sonidosjim.s3.amazonaws.com/radio_brazil/radio_cidade.m3u",
                  "url": "https://17973.live.streamtheworld.com/JBSMOOTHJAZZAAC.aac",
                  //"url": "https://18253.live.streamtheworld.com/RADIOCIDADEAAC.aac",
                  "token": "0",
                  "offsetInMilliseconds": 0
                },
                "metadata": {
                  "title": "JB Classic",
                  //"subtitle": "Música e Informação",
                  "art": {
                    "sources": [
                      {
                        "url": "https://cdn.jb.fm/alexa/Logo_JBClassic_512x512.jpg"
                      }
                    ]
                  },
                  "backgroundImage": {
                    "sources": [
                      {
                        "url": "https://cdn.jb.fm/alexa/Banner_JBclassic_AlexaEchoShow1024x600px.jpg"
                        //"url": "https://sonidosjim.s3.amazonaws.com/radio_brazil/banner_JBFM.jpg"
                      }
                    ]
                  }
                }
              }
			})
			.getResponse();
	}
};



const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent' );
                //|| handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Obrigada por ouvir a JB Classic. Volte quando quiser.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addDirective({
			    //type: 'AudioPlayer.Stop'
			    type: "AudioPlayer.ClearQueue",
                clearBehavior : "CLEAR_ALL"
			})
            .withShouldEndSession(true)
            .getResponse();
    }
};

const PauseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Obrigado por ouvir a JB Classic. Volte quando quiser.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addDirective({
			    type: 'AudioPlayer.Stop'
			})
            .getResponse();
    }
};

const HelpIntentHandler = {
	canHandle(handlerInput)
	{
		return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
			handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
	},
	handle(handlerInput)
	{
		const speechText = 'Ajuda. Para parar, você pode dizer: Alexa, pare. Para reproduzir novamente: Alexa toque JB Classic. Você quer fazer?';
		
		return handlerInput.responseBuilder
			.speak(speechText)
			.addDirective({
				type: 'AudioPlayer.ClearQueue',
				clearBehavior: 'CLEAR_ALL'
			})
			.getResponse();
	}
};

const SessionEndedRequestHandler = {
	canHandle(handlerInput)
	{
		return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
	},
	handle(handlerInput)
	{
		return handlerInput.responseBuilder.withShouldEndSession(true).getResponse();
	}
};

const IntentReflectorHandler = {
	canHandle(handlerInput)
	{
		return handlerInput.requestEnvelope.request.type === 'IntentRequest';
	},
	handle(handlerInput)
	{
		const intentName = handlerInput.requestEnvelope.request.intent.name;
		const speechText = 'NO INTENT HELP TEXT';
		return handlerInput.responseBuilder
			.speak(speechText)
			.getResponse();
	}
};

const ErrorHandler = {
	canHandle()
	{
		return true;
	},
	handle(handlerInput, error)
	{
		const speechText = 'Desculpe, ocorreu um problema. Tente de novo. Você quer fazer?';
		return handlerInput.responseBuilder
			.speak(speechText)
			.reprompt(speechText)
			.getResponse();
	}
};


exports.handler = Alexa.SkillBuilders.custom()
	.addRequestHandlers(
		PlayHandler,
		CancelAndStopIntentHandler,
		PauseIntentHandler,
		HelpIntentHandler,
		SessionEndedRequestHandler,
		IntentReflectorHandler)
	.addErrorHandlers(
		ErrorHandler)
	.lambda();