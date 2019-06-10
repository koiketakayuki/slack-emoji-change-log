class EmojiStatus {
  constructor(emojiName, channelId, timestamp) {
    this.emojiName = emojiName;
    this.channelId = channelId;
    this.timestamp = timestamp;
    this.histories = [];
    this.isRemoved = false;
  }

  addHistory(userId, channelId, timestamp, permalink) {
    this.histories.push({ userId, channelId, timestamp, permalink});
  }

  remove() {
    this.isRemoved = true;
  }

  toText() {
    return `:${this.emojiName}: ( \`:${this.emojiName}:\` ) が追加されました`
  }

  toBlocks() {
    const blocks = [];

    if (this.histories.length > 0) {
      this.histories.forEach(h => {
        blocks.push({
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `<@${h.userId}>が<#${h.channelId}>で使用しました\n${h.permalink}`
          }
        })
      })
    }

    if (this.isRemoved) {
      blocks.push({
        "type": "section",
        "text": {
          "type": "plain_text",
          "text": `このスタンプは削除されました`
        }
      })
    }

    return blocks;
  }
}

module.exports = EmojiStatus;
