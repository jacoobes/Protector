import { TextBasedChannel } from "discord.js";
import { model, Schema } from "mongoose";

const reqString = {
  type: String,
  required: true,
};

export const sticky = model(
  "sticky",
  new Schema({
    //   //channelID
    _id: reqString,
    Message: reqString,
    LastMessageId: reqString,
    MaxCount: {
      type: Number,
      default: 4,
    },
    CurrentCount: {
      type: Number,
      default: 0,
    },
  }),
  "sticky"
);

export async function findSticky(channelID: string) {
  let data = await sticky.findOne({ _id: channelID });
  if (!data) return null;
  return data;
}

export async function deleteMessage(
  channelID: string,
  channel: TextBasedChannel
) {
  let data = await sticky.findOne({ _id: channelID });

  const deletedData = await channel.messages
    .fetch(data?.LastMessageId!)
    .then((m) => {
      m.delete();
    })
    .finally(() => {
      data?.delete();
    });
  return deletedData;
}

export async function makeSticky(
  channelID: string,
  message: string,
  messageID: string,
  max: number,
  channel: TextBasedChannel
) {
  let data = await sticky.findOne({ _id: channelID });
  if (data) {
    await channel.messages.fetch(channel.lastMessageId!).then(async (m) => {
      await m.delete();
    });
  }
  if (!data) {
    let newData = await new sticky({
      _id: channelID,
      Message: message,
      LastMessageId: messageID,
      MaxCount: max,
    }).save();
    return newData;
  }
}
