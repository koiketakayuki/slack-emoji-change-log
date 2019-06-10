slack-emoji-change-log
===

Post statuses about adding/removing emojis on Slack.

### INSTALL

```shell
$ git clone git@github.com:koiketakayuki/slack-emoji-change-log.git
$ cd slack-emoji-change-log
$ npm install
```

#### Set ENVs

- `SLACK_BOT_TOKEN`
  - "Bot User OAuth Access Token" within "OAuth Tokens & Redirect URLs" of your Slack App
- `SLACK_SIGNING_SECRET`
  - "Signing Secret" within "App Credentials" of your Slack App
- `CHANNEL_ID`
  - ID of channel which you want to post. ex: `CHD27GYN8`
  - You can get it from URL of channel like `https://hogehoge.slack.com/messages/CHD27GYN8`.

### RUN

```shell
$ node index.js
```
