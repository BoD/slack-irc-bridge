const CONFIG = require('./config');

const IRCClient = require('irc').Client;

const string = require('string');
const emoji = require('node-emoji');

const ircConfig = {
    port: CONFIG.IRC_PORT,
    secure: CONFIG.IRC_SECURE,
    password: CONFIG.IRC_PASSWORD,
    sasl: CONFIG.IRC_SASL,
    channels: [CONFIG.IRC_CHANNEL]
};

const ircClient = new IRCClient(CONFIG.IRC_SERVER, CONFIG.IRC_NICK, ircConfig);

const {App} = require('@slack/bolt');

const slackApp = new App({
    token: CONFIG.SLACK_TOKEN,
    appToken: CONFIG.SLACK_APP_TOKEN,
    socketMode: true
});

slackApp.message(async ({message}) => {
    if (message.user !== slackUserId) {
        return;
    }
    if (message.channel !== conversationId) {
        return;
    }
    const text = emoji.emojify(
        string(message.text).unescapeHTML().toString()
            .replaceAll(/<(http.?:\/\/.+?)(\|.+)?>/g, "$1")
            .replaceAll(/:slightly_smiling_face:|:blush:|🙂|😊/g, ":)")
            .replaceAll(/:disappointed:|:pensive:|🙁|😞|😔/g, ":(")
            .replaceAll(/:smile:|:grin:|:grinning:|😁|😄/g, ":D")
            .replaceAll(/:stuck_out_tongue:|😛/g, ":P")
            .replaceAll(/:open_mouth:|😮/g, ":O")
            .replaceAll(/:wink:|😉/g, ";)")
            .replaceAll(/:cry:|😢/g, ":'(")
            .replaceAll(/:joy:|😂/g, ":_)")
        ,
        null,
        null
    );
    ircClient.say(CONFIG.IRC_CHANNEL, text);
});

(async () => {
    await slackApp.start();
})();

ircClient.once('raw', function () {
    console.log('Now connected to IRC');
});

ircClient.on('message', function (user, channel, text) {
    if (user === CONFIG.IRC_NICK) {
        return;
    }
    void slackApp.client.chat.postMessage({
        username: user,
        text: text,
        channel: conversationId,
        icon_url: `https://www.gravatar.com/avatar/${getGravatarId(user)}?d=wavatar`,
    });
});

ircClient.on('error', function (error) {
    console.error(error);
});

/**
 * @param {string} user
 */
function getGravatarId(user) {
    let result = '';
    for (let i = 0; i < user.length; i++) {
        result += user.charCodeAt(i).toString(16);
    }
    return result.padStart(32, "0");
}


let conversationId;

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

void findConversation(CONFIG.SLACK_CHANNEL);


let slackUserId;

async function findUser(name) {
    try {
        const result = await slackApp.client.users.list();
        for (const user of result.members) {
            if (user.name === name) {
                slackUserId = user.id;
                break;
            }
        }
    } catch (error) {
        console.error(error);
    }
}

void findUser(CONFIG.SLACK_USER_NAME);
