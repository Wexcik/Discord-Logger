const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const db = require('quick.db');
const kdb = new db.table('kullanici');
const moment = require('moment');
const config = require('./Settings/config.json')
require('moment-duration-format')
var logs = require("discord-logs")
logs(client)
const commands = client.commands = new Discord.Collection();
const aliases = client.aliases = new Discord.Collection();

fs.readdirSync('./commands', { encoding: 'utf8' }).filter(file => file.endsWith(".js")).forEach((files) => {
    let command = require(`./commands/${files}`);
    if (!command.name) return console.log(`Hatalı Kod Dosyası => [/commands/${files}]`)
    commands.set(command.name, command);
    if (!command.aliases || command.aliases.length < 1) return
    command.aliases.forEach((otherUses) => { aliases.set(otherUses, command.name); })
})


client.on('message', message => {
    const prefix = config.prefix; 
    if (!message.guild || message.author.bot || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
    if (!cmd) return;
    cmd.run(client, message, args)
})


client.on('ready', () => {
    client.user.setPresence({ activity: { name:  config.Activity }, status: `${config.Status}` })
    client.channels.cache.get(config.BotVoiceChannel).join()})

    client.on("message", message => {
      if(message.content.toLowerCase() == "tag") 
      return message.channel.send(`${config.Tag}`)
    });

    client.on("message", message => {
      if(message.content.toLowerCase() == ".tag") 
      return message.channel.send(`${config.Tag}`)
    });


    client.on('guildMemberAdd', (member) => {
      member.roles.add(config.UnRegRole)
    
      const wexemb = new Discord.MessageEmbed().setAuthor(member.user.tag, member.user.avatarURL({dynamic: true})).setTimestamp().setColor("BLUE").setDescription(`${member} adlı kullanıcıya başarılı bir şekilde <@&${config.UnRegRole}> rolü verildi.\`\`\`Kullanıcı: ${member.user.tag}\nKullanıcı ID: ${member.id}\nRolün ID: ( ${config.UnRegRole} )\`\`\``)
     client.channels.cache.get(config.JoinLogPlus).send(wexemb);
    
    })


    client.on("guildMemberAdd", member => {
      let toplamüye = member.guild.memberCount
      let amanınanı = client.channels.cache.get(config.JoinLeaveLog);
      amanınanı.send(`:inbox_tray: ${member.user} (\`${member.user.id}\`) katıldı. (\`${toplamüye}\`) kişi olduk.`)
    })

    client.on("guildMemberRemove", member => {
      let toplamüye = member.guild.memberCount
      let babanınanı = client.channels.cache.get(config.JoinLeaveLog);
      babanınanı.send(`:outbox_tray: ${member.user} (\`${member.user.id}\`) ayrıldı. (\`${toplamüye}\`) kişi olduk.`)
    })
    
    client.on("voiceStateUpdate", async (Wex1, Wex2) => {
      let teyzennabuyo = client.channels.cache.get(config.VoiceJoinLeaveLog);
      if (Wex1.channelID && Wex1.selfMute && !Wex2.selfMute) return teyzennabuyo.send(`:speaker: ${Wex2.guild.members.cache.get(Wex2.id).displayName} adlı kullanıcı \`${Wex2.guild.channels.cache.get(Wex2.channelID).name}\` adlı kanalda kendi susturmasını kaldırdı.`).catch();
      if (Wex1.channelID && !Wex1.selfMute && Wex2.selfMute) return teyzennabuyo.send(`:mute: ${Wex2.guild.members.cache.get(Wex2.id).displayName} adlı kullanıcı \`${Wex2.guild.channels.cache.get(Wex2.channelID).name}\` adlı kanalda kendisini susturdu. `).catch();
      if (Wex1.channelID && Wex1.selfDeaf && !Wex2.selfDeaf) return teyzennabuyo.send(`<:wex_undeaf:834190542383874108> ${Wex2.guild.members.cache.get(Wex2.id).displayName} adlı kullanıcı \`${Wex2.guild.channels.cache.get(Wex2.channelID).name}\` adlı kanalda kulaklığını açtı. `).catch();
      if (Wex1.channelID && !Wex1.selfDeaf && Wex2.selfDeaf) return teyzennabuyo.send(`<:wex_deaf:834190542191329291> ${Wex2.guild.members.cache.get(Wex2.id).displayName} adlı kullanıcı \`${Wex2.guild.channels.cache.get(Wex2.channelID).name}\` adlı kanalda kulaklığını kapadı. `).catch();
      if (Wex1.channelID && !Wex1.serverMute && Wex2.serverMute) return teyzennabuyo.send(`:mute: ${Wex2.guild.members.cache.get(Wex2.id).displayName} adlı kullanıcı \`${Wex2.guild.channels.cache.get(Wex2.channelID).name}\` adlı kanaldayken sunucuda mute yedi. `).catch();
      if (Wex1.channelID && Wex1.serverMute && !Wex2.serverMute) return teyzennabuyo.send(`:speaker: ${Wex2.guild.members.cache.get(Wex2.id).displayName} adlı kullanıcı \`${Wex2.guild.channels.cache.get(Wex2.channelID).name}\` adlı kanaldayken sunucudaki mutesi açıldı. `).catch();
      })
      client.on("voiceStateUpdate", async (Wex1, Wex2, ) => {
        let slmbnewex = client.channels.cache.get(config.MicDeafLog); 
        if (!Wex1.channelID && Wex2.channelID) return slmbnewex.send(`:telephone: ${Wex2.guild.members.cache.get(Wex2.id).displayName} adlı kullanıcı \`${Wex2.guild.channels.cache.get(Wex2.channelID).name}\` isimli ses kanalına katıldı! - `).catch();
        if (Wex1.channelID && !Wex2.channelID) return slmbnewex.send(`:telephone: ${Wex2.guild.members.cache.get(Wex2.id).displayName} adlı kullanıcı \`${Wex2.guild.channels.cache.get(Wex1.channelID).name}\` adlı ses kanalından ayrıldı! - `).catch();
        if (Wex1.channelID && Wex2.channelID && Wex1.channelID != Wex2.channelID) return slmbnewex.send(`:telephone: ${Wex2.guild.members.cache.get(Wex2.id).displayName}\` adlı kullanıcı \`${Wex2.guild.channels.cache.get(Wex1.channelID).name}\` adlı ses kanalından çıkıp \`${Wex2.guild.channels.cache.get(Wex2.channelID).name}\` adlı ses kanalına girdi.`).catch();
      })


      client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
        var yıl = [moment().format('YYYY')]
        let aylartoplam = {
          "01": "Ocak",
          "02": "Şubat",
          "03": "Mart",
          "04": "Nisan",
          "05": "Mayıs",
          "06": "Haziran",
          "07": "Temmuz",
          "08": "Ağustos",
          "09": "Eylül",
          "10": "Ekim",
          "11": "Kasım",
          "12": "Aralık"};
      let aylar = aylartoplam;
      let gün = moment(Date.now()).format("DD")
      let saat = moment(Date.now()).format("HH:mm:ss")
      const WexEmbed = new Discord.MessageEmbed().setColor("BLUE").setDescription(`${member.user} ( \`${member.user.tag}\` ) adlı kullanıcının sunucu içerisindeki kullanıcı adı "${newNickname || member.displayName}" olarak değiştirildi.\n\n \`\`\`Kullanıcın Eski adı : ${oldNickname || member.user.tag}\nKullanıcın Yeni adı : ${newNickname || member.user.tag}\nDeğiştirilme Tarihi : ${gün}/${aylar[moment(Date.now()).format("MM")]}/${yıl} ${saat}\`\`\``);
      client.channels.cache.get(config.ServerNickNameLog).send(WexEmbed);
      });

      client.on("userUsernameUpdate", (user, oldUsername, newUsername) => {
        var yıl = [moment().format('YYYY')]
        let aylartoplam = {
          "01": "Ocak",
          "02": "Şubat",
          "03": "Mart",
          "04": "Nisan",
          "05": "Mayıs",
          "06": "Haziran",
          "07": "Temmuz",
          "08": "Ağustos",
          "09": "Eylül",
          "10": "Ekim",
          "11": "Kasım",
          "12": "Aralık"};
      let aylar = aylartoplam;
      let gün = moment(Date.now()).format("DD")
      let saat = moment(Date.now()).format("HH:mm:ss")
        var WexGönder = '832706210380775478'
        const WexEmbed = new Discord.MessageEmbed().setColor("BLUE").setFooter(`${gün}/${aylar[moment(Date.now()).format("MM")]}/${yıl} ${saat}`).setDescription(`
    ${user} ( \`${user.tag}\` ) üyesi Discord kullanıcı adını değiştirdi.
    Yeni kullanıcı adı:
   **"${newUsername || user.displayName}"**  
    Eski kullanıcı adı:
   **${oldUsername || user.tag}**`)
       client.channels.cache.get(config.DiscordNickNameLog).send(WexEmbed);
      });

      client.on("userAvatarUpdate", (user, oldAvatarURL, newAvatarURL) => {
        var yıl = [moment().format('YYYY')]
        let aylartoplam = {
          "01": "Ocak",
          "02": "Şubat",
          "03": "Mart",
          "04": "Nisan",
          "05": "Mayıs",
          "06": "Haziran",
          "07": "Temmuz",
          "08": "Ağustos",
          "09": "Eylül",
          "10": "Ekim",
          "11": "Kasım",
          "12": "Aralık"};
      let aylar = aylartoplam;
      let gün = moment(Date.now()).format("DD")
      let saat = moment(Date.now()).format("HH:mm:ss")
        const WexEmbed = new Discord.MessageEmbed().setFooter(`${gün}/${aylar[moment(Date.now()).format("MM")]}/${yıl} ${saat}`).setColor("BLUE").setTitle(`${user.tag}`).setThumbnail(`${newAvatarURL}`).setDescription(`
      ${user} üyesi Discord Profil resmini değiştirdi.
      Eski:
      ${oldAvatarURL}
      Yeni:
      ${newAvatarURL}`)
       client.channels.cache.get(config.DiscordAvatarLog).send(WexEmbed);
      });

      client.on("guildMemberRoleAdd", (member, roles) => {
        let qwe = client.channels.cache.get(config.RoleLogBasic); 
      qwe.send(`:key: ${member.user.tag} üyesine \`${roles.name}\` rolü eklendi.  `)
      });
      client.on("guildMemberRoleRemove", (member, role) => {
        let qwe = client.channels.cache.get(config.RoleLogBasic); 
      qwe.send(`:wastebasket: ${member.user.tag} üyesinden \`${role.name}\` rolü kaldırıldı.  `)
      });

      client.on("guildMemberRoleAdd", (member, role) => {
        let rolveren = member.guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE' }).then(audit => audit.entries.first());
        var yıl = [moment().format('YYYY')]
        let aylartoplam = {
          "01": "Ocak",
          "02": "Şubat",
          "03": "Mart",
          "04": "Nisan",
          "05": "Mayıs",
          "06": "Haziran",
          "07": "Temmuz",
          "08": "Ağustos",
          "09": "Eylül",
          "10": "Ekim",
          "11": "Kasım",
          "12": "Aralık"};
      let aylar = aylartoplam;
      let gün = moment(Date.now()).format("DD")
      let saat = moment(Date.now()).format("HH:mm:ss")
       member.guild.fetchAuditLogs({
        type: "MEMBER_ROLE_UPDATE"
      }).then(async (audit) => {
      let ayar = audit.entries.first()
      let hedef = ayar.target
      let yapan = ayar.executor
      if (yapan.bot) return
      let YapanKim = `${yapan} (\`${yapan.id}\`)`
      const chatembed = new Discord.MessageEmbed().setFooter(`Eklenme Tarihi: ${gün} ${aylar[moment(Date.now()).format("MM")]} ${yıl} ${saat}`).setAuthor(member.user.tag, member.user.avatarURL({dynamic: true})).setColor("BLUE").setDescription(` 
      ${member} üyesine bir rol **eklendi.**
      
      **Rolü ekleyen kişi:** ${YapanKim || "Bulunamadı."}
      **Eklenen rol:** ${role} (\`${role.id}\`)`)
      client.channels.cache.get(config.RoleLogPlus).send(chatembed);
      });
      })
      
      client.on("guildMemberRoleRemove", (member, role) => {
        let rolveren = member.guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE' }).then(audit => audit.entries.first());
        var yıl = [moment().format('YYYY')]
        let aylartoplam = {
          "01": "Ocak",
          "02": "Şubat",
          "03": "Mart",
          "04": "Nisan",
          "05": "Mayıs",
          "06": "Haziran",
          "07": "Temmuz",
          "08": "Ağustos",
          "09": "Eylül",
          "10": "Ekim",
          "11": "Kasım",
          "12": "Aralık"};
      let aylar = aylartoplam;
      let gün = moment(Date.now()).format("DD")
      let saat = moment(Date.now()).format("HH:mm:ss")
       member.guild.fetchAuditLogs({
        type: "MEMBER_ROLE_UPDATE"
      }).then(async (audit) => {
      let ayar = audit.entries.first()
      let hedef = ayar.target
      let yapan = ayar.executor
      if (yapan.bot) return
      let YapanKim = `${yapan} (\`${yapan.id}\`)`
      const chatembed = new Discord.MessageEmbed().setFooter(`Eklenme Tarihi: ${gün} ${aylar[moment(Date.now()).format("MM")]} ${yıl} ${saat}`).setAuthor(member.user.tag, member.user.avatarURL({dynamic: true})).setColor("BLUE").setDescription(` 
      ${member} üyesinden bir rol **alındı.**

      **Rolü alan kişi:** ${YapanKim || "Bulunamadı."}
      **Alınan rol:** ${role} (\`${role.id}\`)`)
      client.channels.cache.get(config.RoleLogPlus).send(chatembed);
      });
      })

      client.on("voiceChannelJoin", member => {
        var yıl = [moment().format('YYYY')]
        let aylartoplam = {
          "01": "Ocak",
          "02": "Şubat",
          "03": "Mart",
          "04": "Nisan",
          "05": "Mayıs",
          "06": "Haziran",
          "07": "Temmuz",
          "08": "Ağustos",
          "09": "Eylül",
          "10": "Ekim",
          "11": "Kasım",
          "12": "Aralık"};
      let aylar = aylartoplam;
      let gün = moment(Date.now()).format("DD")
      let saat = moment(Date.now()).format("HH:mm:ss")
      
              let mic = member.voice.selfMute == true ? "Kapalı" : "Açık";
              let hop = member.voice.selfDeaf == true ? "Kapalı" : "Açık";
              setTimeout(() => {
                  let embed = new Discord.MessageEmbed()
                  .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
                  .setColor("#43b581")
                  .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                  .setDescription(`
      ${member} üyesi <#${channel.id}> kanalına giriş yaptı.
                  
      Kanaldan çıktığı anda Mikrafonu **${mic}** Kulaklıgı **${hop}**
      
      **Katıldığı Kanal:** \`${channel.name} (${channel.id})\`
      **Kullanıcı:** \`${member.user.tag} (${member.id})\`
      **Kanala Katılma Zamanı:** \`${gün} ${aylar[moment(Date.now()).format("MM")]} ${yıl} - ${saat}\`
      
      \`Kanalda bulunan üyeler:\` \n\n${ channel.members.filter(x => x.id !== member.id).size <= 0 ? "Kanalda hiç üye yok" : channel.members.filter(x => x.id !== member.id).map(x => `${x.user} [${x.user.tag}]`).slice(0, 10).join("\n")}`)
                  .setTimestamp();
                  client.channels.cache.get(config.VoiceLogPlus).send(embed);
      
              // logMessage.send(embed);
          }, 2000);
        })
      
        client.on("voiceChannelLeave", member => {
          var yıl = [moment().format('YYYY')]
          let aylartoplam = {
            "01": "Ocak",
            "02": "Şubat",
            "03": "Mart",
            "04": "Nisan",
            "05": "Mayıs",
            "06": "Haziran",
            "07": "Temmuz",
            "08": "Ağustos",
            "09": "Eylül",
            "10": "Ekim",
            "11": "Kasım",
            "12": "Aralık"};
        let aylar = aylartoplam;
        let gün = moment(Date.now()).format("DD")
        let saat = moment(Date.now()).format("HH:mm:ss")
        
            let mic = member.voice.selfMute == true ? "Kapalı" : "Açık";
            let hop = member.voice.selfDeaf == true ? "Kapalı" : "Açık";
            setTimeout(() => {
              const WexEmbed = new Discord.MessageEmbed()
                .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
                .setColor("#943639")
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`
        ${member} üyesi <#${channel.id}> kanalından ayrıldı.
                
        Kanaldan çıktığı anda Mikrafonu **${mic}** Kulaklıgı ${hop}
        
        **Kanal:** \`${channel.name} (${channel.id})\`
        **Kullanıcı:** \`${member.user.tag} (${member.id})\`
        **Kanaldan Ayrılma Zamanı:** \`${gün} ${aylar[moment(Date.now()).format("MM")]} ${yıl} - ${saat}\`
        
        \`Ayrıldığı Kanalda bulunan üyeler:\` 
        ${channel.members.filter(x => x.id !== member.id).size <= 0 ? "Ayrıldığı kanalda bir kullanıcı bulunamadı." : channel.members.filter(x => x.id !== member.id).map(x => `${x.user} [${x.user.tag}]`).slice(0, 10).join("\n")}`)
                .setTimestamp();
                client.channels.cache.get(config.VoiceLogPlus).send(WexEmbed);
            // logMessage.send(embed);
        }, 2000)
        })

        client.on("voiceChannelSwitch", member => {
          var yıl = [moment().format('YYYY')]
          let aylartoplam = {
            "01": "Ocak",
            "02": "Şubat",
            "03": "Mart",
            "04": "Nisan",
            "05": "Mayıs",
            "06": "Haziran",
            "07": "Temmuz",
            "08": "Ağustos",
            "09": "Eylül",
            "10": "Ekim",
            "11": "Kasım",
            "12": "Aralık"};
        let aylar = aylartoplam;
        let gün = moment(Date.now()).format("DD")
        let saat = moment(Date.now()).format("HH:mm:ss")
        
            let mic = member.voice.selfMute == true ? "Kapalı" : "Açık";
            let hop = member.voice.selfDeaf == true ? "Kapalı" : "Açık";
            setTimeout(() => {
            const embed = new Discord.MessageEmbed()
                .setAuthor(member.user.tag , member.user.displayAvatarURL({dynamic: true}))
                .setColor("#faa61a")
                .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
                .setDescription(`
                ${member} üyesi <#${oldChannel.id}> kanalından <#${newChannel.id}> kanalına geçiş yaptı.
                
        Kanallar arasında geçiş anında Mikrafonu **${mic}** Kulaklıgı ${hop}
        
                
        
        **Kullanıcının eski kanalı:** \`${oldChannel.name} (${oldChannel.id})\`
        **Kullanıcının yeni kanal:** \`${newChannel.name} (${newChannel.id})\`
        **Kullanıcı:** \`${member.user.tag} (${member.id})\`
        **Kanaldan Değiştirme Zamanı:** \`${gün} ${aylar[moment(Date.now()).format("MM")]} ${yıl} - ${saat}\`
        
        \`Eski kanalda bulunan üyeler:\` 
                
        ${oldChannel.members.filter(x => x.id !== member.id).size <= 0 ? "Eski bulunduğu kanalda bir kullanıcı bulunamadı. " : oldChannel.members.filter(x => x.id !== member.id).map(x => `${x.user} [${x.user.tag}]`).slice(0,10).join("\n")}\n\n\`Yeni kanalda bulunan üyeler:\` \n\n${newChannel.members.filter(x => x.user.id !== member.user.id).size <= 0 ? "Yeni katıldıgı kanalda bir kullanıcı bulunamadı.": newChannel.members.filter(x => x.id !== member.id).map(x => `${x.user} [${x.user.tag}]`).slice(0,10).join("\n")}`)
                .setTimestamp();
                client.channels.cache.get(config.VoiceLogPlus).send(embed);
        
            // logMessage.send(embed);
        }, 2000);
        })

        client.on("userUpdate", async function(oldUser, newUser) {
          const GuildID = config.GuildID
          const RoleID = config.RoleID
          const UserNameTag = config.Tag
          const Channnel = config.TaggesChannel

          const guild = client.guilds.cache.get(GuildID)
          const role = guild.roles.cache.find(roleInfo => roleInfo.id === RoleID)
          const member = guild.members.cache.get(newUser.id)
        const tagosbir2 = guild.members.cache.filter(u => u.user.username.includes(UserNameTag)).size
          if (newUser.username !== oldUser.username) {
              if (oldUser.username.includes(UserNameTag) && !newUser.username.includes(UserNameTag)) {
                  member.roles.remove(RoleID)
                  client.channels.cache.get(Channnel).send(`<@${newUser.id}> adlı üye ( ${UserNameTag} ) tagını kullanıcı adından silerek aramızdan ayrıldı! | **Sunucuda bulunan toplam taglı üyemiz: **(\`${etiketteki+tagosbir+tagosbir2}\`)\n─────────────────\nÖnce ki kullanıcı adı: \`${oldUser.tag}\` | Sonra ki kullanıcı adı: \`${newUser.tag}\``)
              } else if (!oldUser.username.includes(UserNameTag) && newUser.username.includes(UserNameTag)) {
                  member.roles.add(RoleID)
                  client.channels.cache.get(Channnel).send(`<@${newUser.id}> adlı üye ( ${UserNameTag} ) tagını kullanıcı adına yerleştirerek aramıza katıldı! | **Sunucuda bulunan toplam taglı üyemiz: **(\`${etiketteki+tagosbir+tagosbir2}\`)\n─────────────────\nÖnce ki kullanıcı adı: \`${oldUser.tag}\` | Sonra ki kullanıcı adı: \`${newUser.tag}\``)
              }
            }})
client.login(config.token).then(console.log(`[WexOnTheBeach] Log Botu Başarılı bir şekilde başlatıldı. [Bot: ${client.user}]`)).catch(e => console.error(e));