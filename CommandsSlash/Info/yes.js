const { ContextMenuBuilder, MessageEmbed } = require('discord.js');

module.exports = {
    data: new ContextMenuBuilder()
        .setName('report')
        .setType('MESSAGE'), // This sets the context menu to appear for messages
    async execute(interaction) {
        const { user, target } = interaction;
        
        if (!target.isMessage()) return;
        
        const message = target;
        const reportEmbed = new MessageEmbed()
            .setTitle(`Reported Message`)
            .addFields(
                { name: 'Message ID', value: message.id },
                { name: 'Message Content', value: message.content },
                { name: 'Reported by', value: user.tag },
                { name: 'Reported User', value: message.author.tag }
            )
            .setColor('#FF0000'); // Use uppercase 'RED' for color
        
        await user.send({ embeds: [reportEmbed] });

        const reportChannel = interaction.guild.channels.cache.get('YOUR_REPORT_CHANNEL_ID');
        if (reportChannel) {
            await reportChannel.send({ embeds: [reportEmbed] });
        }

        await interaction.reply({ content: 'Reported message details have been sent to your direct messages and the specified report channel.', ephemeral: true });
    }
};
