import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { getAllFiles } from "../utils/filesystem.js";
export class EventHandler {
    _eventCallbacks = new Map();
    _instance;
    _eventsDir;
    _client;
    _events;
    _builtInEvents;
    constructor({ instance, events, client }) {
        this._instance = instance;
        this._eventsDir = events?.dir;
        this._client = client;
        delete events.dir;
        this._events = events;
        this._builtInEvents = {
            interactionCreate: {
                isButton: async (interaction) => interaction.isButton(),
                isCommand: async (interaction) => interaction.isCommand(),
                isContextMenu: async (interaction) => interaction.isContextMenu(),
                isModalSubmit: async (interaction) => interaction.isModalSubmit(),
                isSelectMenu: async (interaction) => interaction.isSelectMenu(),
                isTextInput: async (interaction) => interaction.isTextInput(),
                isUserContextMenu: async (interaction) => interaction.isUserContextMenu(),
                isMessageContextMenu: async (interaction) => interaction.isMessageContextMenu(),
                isAutocomplete: async (interaction) => interaction.isAutocomplete(),
                isChatInputCommand: async (interaction) => interaction.isChatInputCommand()
            },
            messageCreate: {
                isHuman: async (message) => !message.author.bot
            }
        };
        this.readFiles(true);
    }
    async readFiles(register = false) {
        const __filename = fileURLToPath(import.meta.url);
        const dirname = path.dirname(__filename);
        const defaultEventsDir = path.join(dirname, "events");
        const defaultEvents = getAllFiles(defaultEventsDir, true);
        const events = [...defaultEvents];
        if (this._eventsDir) {
            const folders = getAllFiles(this._eventsDir, true);
            events.push(...folders);
        }
        for (const path of events) {
            const event = path.split(/[\/\\]/g).pop();
            if (!event)
                continue;
            const files = getAllFiles(path);
            const functions = this._eventCallbacks.get(event) || [];
            for (const file of files) {
                const isBuiltIn = path.includes(defaultEventsDir);
                const fileUrl = pathToFileURL(file).href;
                const { default: func } = (await import(fileUrl));
                const result = [func];
                const split = file.split(event)[1].split(/[\/\\]/g);
                const methodName = split[split.length - 2];
                if (isBuiltIn &&
                    this._builtInEvents[event] &&
                    this._builtInEvents[event]?.[methodName]) {
                    result.push(this._builtInEvents[event]?.[methodName]);
                }
                else if (this._events[event] &&
                    this._events[event][methodName]) {
                    result.push(this._events[event][methodName]);
                }
                functions.push(result);
            }
            this._eventCallbacks.set(event, functions);
        }
        if (register) {
            this.registerEvents();
        }
    }
    registerEvents() {
        const instance = this._instance;
        for (const eventName of this._eventCallbacks.keys()) {
            const events = this._eventCallbacks.get(eventName) || [];
            this._client.on(eventName, async function () {
                for (const [event, dynamicValidation] of events) {
                    if (dynamicValidation &&
                        !(await dynamicValidation(...arguments)))
                        continue;
                    if (event.callback) {
                        event.callback(...arguments, instance);
                    }
                }
            });
        }
    }
}
//# sourceMappingURL=EventHandler.js.map