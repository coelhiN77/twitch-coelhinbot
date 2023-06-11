require("dotenv").config();
const tmi = require('tmi.js');

const opts = {
  options: {
    debug: true,
  },
  identity: {
    username: process.env.BOT_U,
    password: process.env.BOT_T,
  },
  channels: [
    process.env.BOT_C
  ]
};

const client = new tmi.client(opts);

// Block words
const blocked_words = ['monkey', 'bitch', 'cats', 'ugly', 'bluepen'];

// Bot Colors
const colors = ["SpringGreen", "Chocolate", "Coral", "Firebrick", "Green", "HotPink", "OrangeRed", "Red", "SeaGreen", "Blue"];

client.on('chat', onChatHandler);
client.on('connected', onConnectedBot);
client.on('message', (channel, userstate, message, self) => {
  checkChat(channel, userstate, message);
});
client.connect();

function onChatHandler(target, context, msg, self) {
  if (self) { return; }

  if (/\bhello\b/i.test(msg)) {
    client.action(process.env.BOT_C, 'Hello bro, enjoy the live ♡');
  };

  if (/\bbye\b/i.test(msg)) {
    client.action(process.env.BOT_C, 'Bye bro, see ya! 👋');
  };
};

client.on('message', (channel, tags, message, self, target, context, msg) => {
  if (self || !message.startsWith('-')) return;
  const args = message.slice(1).split(' ');
  const command = args.shift().toLowerCase();

  // GLOBAL COMMANDS
  if (command === 'help') {
    client.say(channel, 'Commands are: creator, time, surprise');
  };

  if (command === 'creator') {
    client.say(channel, 'The creator here: https://github.com/coelhiN77');
  };

  if (command === 'time') {
    const currentTime = new Date().toLocaleTimeString();
    const response = `The current time is: ${currentTime}`;
    client.action(channel, response);
  };

  if (command === 'dice') {
    const num = rollDice();
    client.say(channel, `You rolled a【${num}】 @${tags.username}`);
  };

  if (command === 'weathertd') {
    const spin = rollWeather();
    client.say(channel, `Today is ${spin} @${tags.username}`);
  };

  if (command === 'surprise') {
    client.say(channel, `Here @${tags.username}: https://www.youtube.com/watch?v=dQw4w9WgXcQ`);
  };

  if (command === 'bot') {
    client.say(channel, 'Hello my name is coelhiNBot. I am a bot made with Typescript by coelhiN');
  };

  if (command === 'echo') {
    if (args.length === 0) {
      client.say(channel, `@${tags.username}, you didn't say anything. Type something`);
    } else {
      const message = args.join(' ');
      client.say(channel, `@${tags.username}, you said: "${message}".`);
    }
  };

  if (command === '8ball') {
    if (args.length === 0) {
      client.say(channel, `@${tags.username} ask me a question so I can tell you the answers`);
    } else {
      const answers = rollAnswers();
      client.say(channel, `${answers} - @${tags.username}`);
    }
  };

  if (command === 'ping') {
    const startTime = Date.now();
    client.say(process.env.BOT_C, '')
      .then(() => {
        const endTime = Date.now();
        const latency = endTime - startTime;
        client.say(process.env.BOT_C, `Latency: ${latency}ms`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (command === 'delay') {
    client.say(channel, 'This live has no delay')
  };

  // STAFF COMMANDS
  if (command === 'colorbot') {
    const color = colors[Math.floor(Math.random() * colors.length)];
    client.say(process.env.BOT_C, `/color ${color}`);
    client.say(process.env.BOT_C, 'Bot color changed');
  };

  if (command === 'adbot') {
    client.commercial(process.env.BOT_C, 30)
      .then(() => {
        client.say(process.env.BOT_C, 'Watch this beautiful AD 📺');
      })
      .catch((err) => {
        client.say(process.env.BOT_C, 'Wait a little longer to pass the AD');
      })
  };

  if (command === 'hostc') {
    const targetChannel = args[0];

    if (targetChannel) {
      client.say(process.env.BOT_C, `/host ${targetChannel}`);
      client.say(process.env.BOT_C, 'See you later, enjoy the live');
    } else {
      client.say(process.env.BOT_C, 'You need to provide the name of the channel you want to host.');
    }
  };

  if (command === 'modlist') {
    client.mods(process.env.BOT_C);
  };

  if (command === 'followY') {
    client.followersonly(process.env.BOT_C);
  };

  if (command === 'followN') {
    client.followersonlyoff(process.env.BOT_C);
  };

  if (command === 'emoteY') {
    client.emoteonly(process.env.BOT_C);
  };

  if (command === 'emoteN') {
    client.emoteonlyoff(process.env.BOT_C)
  };

  if (command === 'timeout') {
    const username = args[0];
    const duration = parseInt(args[1]);
    const reason = args.slice(2).join(' ');

    if (!username || isNaN(duration) || duration <= 0) {
      client.say(process.env.BOT_C, 'Invalid timeout command format. Please use: -timeout <username> <duration> <reason>');
      return;
    }

    client.timeout(process.env.BOT_C, username, duration, reason)
      .then(() => {
        client.say(process.env.BOT_C, `Timeout command executed successfully. ${username} has been timed out for ${duration} seconds. Reason: ${reason}`);
      })
      .catch((err) => {
        client.say(process.env.BOT_C, 'An error occurred while executing the timeout command. Please try again later.');
        console.error(err);
      });
  };
});

function rollDice() {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
};

function rollAnswers() {
  const answers = [
    'It is certain',
    'It is decidedly so',
    'Without a doubt',
    'Yes, definitely',
    'You may rely on it',
    'As I see it, yes',
    'Most likely',
    'Outlook good',
    'Yes',
    'Signs point to yes',
    'Reply hazy try again',
    'Ask again later',
    'Better not tell you now',
    'Cannot predict now',
    'Concentrate and ask again',
    "Don't count on it",
    'My reply is no',
    'My sources say no',
    'Outlook not so good',
    'Very doubtful'
  ];
  return answers[Math.floor(Math.random() * answers.length)];
};

function rollWeather() {
  const climates = ['sunny', 'cloudy', 'raining'];
  return climates[Math.floor(Math.random() * climates.length)];
};

function checkChat(channel, username, message) {
  let shouldSendMessage = false;
  message = message.toLowerCase();
  shouldSendMessage = blocked_words.some(blockedWord => message.includes(blockedWord.toLowerCase()));

  if (shouldSendMessage) {
    client.deletemessage(channel, username.id)
      .then((data) => {
        //...
      }).catch((err) => {
        //...
      });
    client.say(channel, `@${username.username} omg your message has been deleted`);
  };
};

function onConnectedBot(addr, port) {
  console.log(`BOT: Connected to ${addr}:${port}`);
  client.action(process.env.BOT_C, 'Hello coelhiN, your bot is here');
};