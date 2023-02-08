import { hold } from "#client";
import { commandModule, CommandType } from "@sern/handler";
import { Colors, EmbedBuilder, TextChannel } from "discord.js";

export default commandModule({
  type: CommandType.Modal,
  name: "verify-form",
  description: "Completes verification into server.",
  execute: async (modal) => {
    const { client } = modal;
    const mcusername = modal.fields.getTextInputValue("mcusername");
    const inviter = modal.fields.getTextInputValue("inviter");
    let guild = await modal.client.guilds.fetch("1070233836354539600");
    let modChannel = (await guild.channels.fetch(
      "1070802110159015936"
    )) as TextChannel;
    let verifiedRole = await guild.roles.fetch("1070569324974186587");
    let newRole = await guild.roles.fetch("1070569561071558677");
    let member = await guild.members.fetch(modal.user.id);
    const acceptedUsers: string | string[][] = client.users.cache
      .map((user) => `${user.tag} (${user.id})`)
      .join(", ");
    if (!acceptedUsers.includes(inviter)) {
      return modal.reply(
        "That user is not in this guild. \
       Please check spelling and formatting of your inviter's user tag. \
       Must include `#0000` at the end."
      );
    }
    modal.reply("Thank you for verifying. Wait 5 seconds for completion.");
    await hold(5000);
    const embed = new EmbedBuilder({
      title: "Another Successful Verification!",
      color: Colors.Green,
      description: `${modal.user.username} has passed server verification!`,
      fields: [
        { name: "Inviter", value: inviter, inline: true },

        { name: "Minecraft Username", value: mcusername, inline: true },
      ],
      thumbnail: {
        url: `${modal.user.avatar ? modal.user.displayAvatarURL() : null}`,
      },
      footer: {
        text: `${modal.client.user.username}`,
        iconURL: modal.client.user.displayAvatarURL(),
      },
    }).setTimestamp();
    await guild.systemChannel?.bulkDelete(5);
    await member.roles.remove(newRole!.id);
    await member.roles.add([verifiedRole!.id]);
    await member.setNickname(mcusername!.toString());
    await modChannel.send({
      embeds: [embed],
    });
  },
});
