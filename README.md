# slack-irc-bridge

slack-irc-bridge is a solution for mirroring a Slack channel to an IRC channel and vice-versa.

### Install

```shell
$ npm install
```

### Copy `.env-example` to `.env`

```shell
$ cp .env-example .env
```

### Configure `.env`

```shell
IRC_SERVER=irc.testbot.org
IRC_PORT=6697
IRC_SECURE=1
IRC_NICK=SlackBot
IRC_PASSWORD=SlackBotPassword
IRC_CHANNEL=#ircchannel
SLACK_CHANNEL=#slackchannel
SLACK_TOKEN=xoxb...8WRqKWx
NODE_ENV=development
PORT=3000
IRC_IGNORE_RULES=[{"user":"^unrMtp$","text":"^oui$"}]
```

`IRC_IGNORE_RULES` is optional. It must be a JSON array of rules, where each rule can define:

- `user`: a regular expression matched against the IRC nickname
- `text`: a regular expression matched against the IRC message body

If both are present, both must match for the message to be ignored. If only one is present, that one is enough to ignore the message.

Example:

```shell
IRC_IGNORE_RULES=[{"user":"^unrMtp$","text":"^oui$"},{"user":"^bot-.*"}]
```

This ignores:

- messages from `unrMtp` whose text is exactly `oui`
- any message from a nickname starting with `bot-`

### Run

```shell
$ npm start
```

### Deploy

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
