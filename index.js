const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const EmojiStatus = require("./emoji-status");

const token = process.env.SLACK_BOT_TOKEN;
const channelId = process.env.CHANNEL_ID;
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const port = process.env.PORT || 3000;

const slackEvents = createEventAdapter(slackSigningSecret);
const web = new WebClient(token);

const emojiStatuses = {};

slackEvents.on('reaction_added', async (event) => {
  const emojiName = event.reaction;

  if (emojiStatuses[emojiName]) {
    const status = emojiStatuses[emojiName];

    const { permalink } = await web.chat.getPermalink({
      channel: event.item.channel,
      message_ts: event.item.ts
    });

    status.addHistory(event.user, event.item.channel, event.event_ts, permalink);

    await web.chat.update({
      channel: channelId,
      ts: status.timestamp,
      text: status.toText(),
      attachments: status.toAttachments()
    });
  }
});

slackEvents.on('emoji_changed', async (event) => {
  if (event.subtype === 'add') {
    const emojiName = event.name;

    const status = new EmojiStatus(emojiName, channelId);
    const { ts } = await web.chat.postMessage({
      text: status.toText(),
      attachments: status.toAttachments(),
      channel: channelId,
    });

    status.timestamp = ts;
    emojiStatuses[emojiName] = (status);

    setTimeout(() => {
      delete emojiStatuses[emojiName];
    }, 300000);
  }

  if (event.subtype === 'remove') {
    const emojiNames = event.names;

    emojiNames.forEach(async (emojiName) => {
      if (emojiStatuses[emojiName]) {
        const status = emojiStatuses[emojiName];
        status.remove();

        await web.chat.update({
          channel: channelId,
          ts: status.timestamp,
          text: status.toText(),
          attachments: status.toAttachments()
        });

        delete emojiStatuses[emojiName];
      }
    });
  }
});

slackEvents.on('error', console.error);

(async () => {
  const server = await slackEvents.start(port);
  console.log(`Listening for events on ${server.address().port}`);
})();
