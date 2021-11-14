const Discord = require('discord.js');
const config = require('../Settings/config.json')


module.exports = {
    name: 'ping',
    aliases: ['ms'],
    run: async(client, message, args) => {

  if(message.author.id !== config.OwnerID) return;
  message.channel.send(`\`${client.ws.ping}\` ping`)


  

}}