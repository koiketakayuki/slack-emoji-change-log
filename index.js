const { RTMClient } = require('@slack/rtm-api');
 
// Read a token from the environment variables
const token = process.env.SLACK_BOT_TOKEN;
const channelId = process.env.CHANNEL_ID;

 
// Initialize
const rtm = new RTMClient(token);

rtm.on('emoji_changed', (event) => {
  if (event.subtype === 'add') {
    const emojiName = event.name;

    rtm.sendMessage(`:${emojiName}:が追加されました`, channelId);
  }
});

(async () => {
  // Connect to Slack
  await rtm.start();
})();