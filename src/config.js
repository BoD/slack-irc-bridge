if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    require('dotenv').config({path: '/tmp/env/.env'});
}

function parseIgnoreRules(value) {
    if (!value) {
        return [];
    }

    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
            throw new Error('IRC_IGNORE_RULES must be a JSON array');
        }

        return parsed.map((rule, index) => {
            if (!rule || typeof rule !== 'object') {
                throw new Error(`IRC_IGNORE_RULES[${index}] must be an object`);
            }

            return {
                user: typeof rule.user === 'string' ? rule.user : null,
                text: typeof rule.text === 'string' ? rule.text : null,
            };
        });
    } catch (error) {
        console.error(`Failed to parse IRC_IGNORE_RULES: ${error.message}`);
        return [];
    }
}

module.exports = {
    IRC_SERVER: process.env.IRC_SERVER,
    IRC_PORT: parseInt(process.env.IRC_PORT, 10),
    IRC_SECURE: process.env.IRC_SECURE === 'true',
    IRC_NICK: process.env.IRC_NICK,
    IRC_USER_NAME: process.env.IRC_USER_NAME,
    IRC_PASSWORD: process.env.IRC_PASSWORD,
    IRC_CHANNEL: process.env.IRC_CHANNEL,
    IRC_SASL: process.env.IRC_SASL === 'true',
    SLACK_CHANNEL: process.env.SLACK_CHANNEL,
    SLACK_TOKEN: process.env.SLACK_TOKEN,
    SLACK_APP_TOKEN: process.env.SLACK_APP_TOKEN,
    SLACK_USER_NAME: process.env.SLACK_USER_NAME,
    IRC_IGNORE_RULES: parseIgnoreRules(process.env.IRC_IGNORE_RULES),
    NODE_ENV: process.env.NODE_ENV,
};
