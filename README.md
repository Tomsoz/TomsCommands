# Tom's Commands

A flexible and easy-to-use command handler built with TypeScript.
This was designed mainly for my own use but anybody can contribute.
I've tried to keep it fully type safe and I'm aware that it's very messy but it's still a work in progress
-# yes the readme was ai generated because i couldn't be bothered to write one

## Installation

```bash
npm install toms-commands
```

## Usage

```typescript
import { Client, IntentsBitField } from "discord.js";
import path from "path";
import { Handlers } from "toms-discord-handlers";
import dirname from "./dirname.js";
import { env } from "./env.js";

const client = new Client({
	intents: [
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.Guilds
	]
});

client.once("ready", () => {
	console.log(`Logged in as ${client.user?.tag}`);

	const commandsDir = path.join(dirname(), "commands");
	const handlers = new Handlers({
		client: client as any,
		databaseUrl: env.databaseUrl,
		commandsDir,
		devGuilds: ["1329590192901849113"]
	});
});

client.login(env.discordToken);
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` file for more information.
