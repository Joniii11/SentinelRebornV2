const { SlashCommandBuilder, messageLink } = require("@discordjs/builders")
const { MessageEmbed, EmbedBuilder, Embed } = require("discord.js")
const fs = require("fs")
const moment = require("moment")
const Economy = require('discord-economy-super')
const eco = require('../../Database/ecoDB.js')

module.exports = {
	data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Deposit money to the bank")
    .addNumberOption(option =>
        option.setName('amount')
        .setDescription('Amount to deposit').setRequired(true)),
		async execute(interaction, client) {
            const { guild, member } = interaction;

            const amount = interaction.options.getNumber("amount")
            const balance = eco.balance.fetch(member.id, guild.id)

            if (amount > balance) {
                return interaction.reply({content:`You do not have this much balance!`, ephemeral: true})
            }

            if (amount < 1) {
                return interaction.reply({content:`You cannot deposit such a little amount!`, ephemeral: true})
            }

            eco.balance.subtract(amount, member.id, guild.id)
            eco.bank.add(amount, member.id, guild.id)


        const embed = new EmbedBuilder()
        .setTitle(`Bank Deposit`)
        .setColor(`c3b4f7`)
        .setDescription(`Bank deposit successful!`)
        .addFields(
            {
                name: `Amount`,
                value: `\`${amount}🪙\``,
                inline: true
            }
        )
        .setTimestamp()
        .setFooter({ text: `/${interaction.commandName} || ${interaction.user.tag}`, iconURL: client.user.displayAvatarURL()})

        await interaction.reply({ embeds: [embed]});

 
  
    }}