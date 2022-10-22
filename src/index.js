const CONFIG = require('./config');

var IRCClient = require('irc').Client;

var string = require('string');
var emoji = require('node-emoji');

var ircConfig = {
  port: CONFIG.IRC_PORT,
  secure: CONFIG.IRC_SECURE,
  password: CONFIG.IRC_PASSWORD,
  sasl: CONFIG.IRC_SASL,
  channels: [CONFIG.IRC_CHANNEL]
};

var ircClient = new IRCClient(CONFIG.IRC_SERVER, CONFIG.IRC_NICK, ircConfig);

const { App } = require('@slack/bolt');

const slackApp = new App({
  token: CONFIG.SLACK_TOKEN,
  appToken: CONFIG.SLACK_APP_TOKEN,
  socketMode: true
});

slackApp.message(async ({ message, say }) => {
  var text = emoji.emojify(string(message.text).unescapeHTML().toString());
  ircClient.say(CONFIG.IRC_CHANNEL, text);
});

(async () => {
  await slackApp.start();
})();

ircClient.once('raw', function (message) {
  console.log('Now connected to IRC');
});

ircClient.on('message', function (user, channel, text) {
  if (user === CONFIG.IRC_NICK) {
    return;
  }

  slackApp.client.chat.postMessage({
    username: user,
    text: text,
    channel: conversationId,
  });
});

ircClient.on('error', function (error) {
  console.error(error);
});


var conversationId;

async function findConversation(name) {
  try {
    const result = await slackApp.client.conversations.list({types: "public_channel,private_channel"});
    for (const channel of result.channels) {
      if (channel.name === name) {
        conversationId = channel.id;
        break;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

findConversation(CONFIG.SLACK_CHANNEL);