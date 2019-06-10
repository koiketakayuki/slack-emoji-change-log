const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');

const token = process.env.SLACK_BOT_TOKEN;
const channelId = process.env.CHANNEL_ID;
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;

const slackEvents = createEventAdapter(slackSigningSecret);
const port = process.env.PORT || 3000;
const web = new WebClient(token);

slackEvents.on('emoji_changed', async (event) => {
  if (event.subtype === 'add') {
    const emojiName = event.name;


    await web.chat.postMessage({
      text: `:${emojiName}: ( \`:${emojiName}:\` ) が追加されました`,
      channel: channelId,
    });
  }

  if (event.subtype === 'remove') {
    const emojiNames = event.names;

    emojiNames.forEach(async (emojiName) => {
      await web.chat.postMessage({
        text: `:${emojiName}: ( \`:${emojiName}:\` ) が削除されました`,
        channel: channelId,
      });
    });
  }
});

slackEvents.on('error', console.error);

(async () => {
  const server = await slackEvents.start(port);
  console.log(`Listening for events on ${server.address().port}`);
})();
