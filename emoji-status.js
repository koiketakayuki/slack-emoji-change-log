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

  toAttachments() {
    const attachments = this.histories.map(h => ({
      color: "good",
      title: `<@${h.userId}>が<#${h.channelId}>で:${this.emojiName}:を使用しました`,
      ts: h.timestamp,
      text: h.permalink
    }));

    if (this.isRemoved) {
      attachments.push({
        color: "danger",
        text:  `\`:${this.emojiName}:\`が削除されました`,
      })
    }

    return attachments;
  }
}

module.exports = EmojiStatus;
