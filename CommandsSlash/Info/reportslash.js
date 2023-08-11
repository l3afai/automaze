const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
                .setName('report')
                .setDescription('Report a message and receive its details in a private message.')
                .addStringOption(option => 
                    option.setName('message_link')
                        .setDescription('Link to the reported message')
                        .setRequired(true)),
    category: 'Moderation', // Adjust the category as needed
    async execute(interaction) {
        const messageLink = interaction.options.getString('message_link');
        
        // Extract guild ID and message ID from the link
        const [, guildId, messageId] = messageLink.match(/\/(\d+)\/(\d+)/);
        
        try {
            const guild = interaction.client.guilds.cache.get(guildId);
            if (!guild) {
                throw new Error('Guild not found.');
            }
            
            const channel = guild.channels.cache.find(channel => channel.isText());
            if (!channel) {
                throw new Error('Text channel not found.');
            }
            
            const message = await channel.messages.fetch(messageId);
            
            const reportEmbed = new EmbedBuilder()
                .setTitle(`Reported Message`)
                .addField('Message ID', message.id)
                .addField('Message Content', message.content)
                .setColor(`Red`);
            
            const user = interaction.user;
            await user.send({ embeds: [reportEmbed] });
            interaction.reply(`Reported message details have been sent to your direct messages.`);
        } catch (error) {
            interaction.reply(`Error: ${error.message}`);
        }
    }
};
