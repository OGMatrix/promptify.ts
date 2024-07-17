import readline from "readline";
import { Format, Prompt, Selection } from "../type";
import {
  InputJsonOutput,
  InputPromptSettings,
  InputSelectionSettings,
} from "../interfaces";
import { Design } from "../enums";

export class Input {
  public VERSION = "0.0.1";
  public AUTHOR = "OGMatrix";
  public ID = "";
  private colors = {
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    reset: "\x1b[0m",
  };

  private isLetter(text: string): boolean {
    return /^[a-zA-Z]$/.test(text);
  }

  private isNumber(text: string): boolean {
    return /^[0-9]$/.test(text);
  }

  private isSymbol(text: string): boolean {
    return /^[_,-]$/.test(text);
  }

  constructor() {}

  private format(
    text: string,
    toFormat: Format,
    data: any = {}
  ): InputJsonOutput | string {
    if (toFormat === "json") {
      if (data) data.answer = text;
      return data;
    } else if (toFormat === "text") {
      return text;
    }

    return "";
  }

  async prompt({
    type,
    q,
    required = true,
    format = "json",
    design = { header: Design.Modern, body: Design.Modern },
  }: InputPromptSettings): Promise<string | InputJsonOutput | null> {
    const questionText = `🚀  ${q}`;
    const padding = Math.max(43 - questionText.length, 0);
    const paddingLeft = Math.floor(padding / 2);
    const paddingRight = padding - paddingLeft;
    const text =
      "\u00a0".repeat(paddingLeft) +
      this.colors.cyan +
      questionText +
      this.colors.reset +
      "\u00a0".repeat(paddingRight);

    console.log("┌───────────────────────────────────────────┐");
    console.log(`│${"\u00a0".repeat(43)}│`);
    console.log(`│${"\u00a0".repeat(43)}│`);
    console.log(`│${text}│`);
    console.log(`│${"\u00a0".repeat(43)}│`);
    console.log(`│                                   V${this.VERSION}  │`);
    console.log("└───────────────────────────────────────────┘");
    if (type === "text") {
      console.log("\u00a0\u00a0💬 YOU:");
      process.stdout.clearLine(0);
      process.stdout.cursorTo(10, process.stdout.rows - 2);
    } else if (type === "number") {
      console.log("\u00a0\u00a0💬 YOU:");
      process.stdout.clearLine(0);
      process.stdout.cursorTo(10, process.stdout.rows - 2);
    } else if (type === "word") {
      console.log("Word");
    } else {
      return null;
    }

    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    return new Promise(async (resolve, reject) => {
      let input: string[] = [];

      const handleKeypress = async (chunk: any, key: any) => {
        if (!key) return;
        if (chunk) {
        }
        // console.log(key);
        if (key.name === "c" && key.ctrl) process.exit();
        else if (key.name === "return") {
          if (required && input.length == 0) return;
          process.stdout.cursorTo(10, process.stdout.rows - 2);
          console.log(
            this.colors.cyan +
              input.join("") +
              this.colors.reset +
              "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"
          );
          await process.stdout.cursorTo(0, process.stdout.rows);
          process.stdin.end();
          process.stdin.removeListener("keypress", handleKeypress);
          await resolve(this.format(input.join(""), format));
        } else {
          if (key.name === "backspace") {
            input.pop();
          } else if (key.name === "space") input.push(" ");
          else {
            if (
              type === "text" &&
              (key.name ? key.name.length == 1 : key.sequence.length == 1) &&
              (this.isLetter(key.name) ||
                this.isNumber(key.name) ||
                (key.sequence ? this.isSymbol(key.sequence) : false))
            ) {
              input.push(key.name ? key.name : key.sequence);
            } else if (type === "number" && this.isNumber(key.name)) {
              input.push(key.name);
            } else if (type === "word") {
              console.log("Word");
            }
          }

          process.stdout.cursorTo(
            10 + input.length - 1,
            process.stdout.rows - 2
          );
          console.log(
            (input.length > 0 ? input[input.length - 1] : "") +
              "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"
          );
          process.stdout.cursorTo(10 + input.length, process.stdout.rows - 2);
        }
      };
      process.stdin.on("keypress", handleKeypress);
    });
  }

  async selection({
    type,
    choices,
    q,
    format = "json",
    design = { header: Design.Modern, body: Design.Modern },
  }: InputSelectionSettings) {
    // GENERAL CONSOLE PRINT :)
    const questionText = `🚀  ${q}`;
    const padding = Math.max(43 - questionText.length, 0);
    const paddingLeft = Math.floor(padding / 2);
    const paddingRight = padding - paddingLeft;
    const text =
      "\u00a0".repeat(paddingLeft) +
      this.colors.cyan +
      questionText +
      this.colors.reset +
      "\u00a0".repeat(paddingRight);

    console.log("┌───────────────────────────────────────────┐");
    console.log(`│${"\u00a0".repeat(43)}│`);
    console.log(`│${"\u00a0".repeat(43)}│`);
    console.log(`│${text}│`);
    console.log(`│${"\u00a0".repeat(43)}│`);
    console.log(`│                                   V${this.VERSION}  │`);
    console.log("└───────────────────────────────────────────┘");

    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) process.stdin.setRawMode(true);

    // SELECTION METHOD
    return new Promise(async (resolve, reject) => {
      if (type === "single") {
        let lastChoice = 0;
        let curChoice = 0;
        console.log(
          `[Press enter to choose selected choice or CTRL+C to exit]`
        );
        for await (const choice of choices) {
          console.log(` -  ${choice}`);
        }

        process.stdout.cursorTo(
          0,
          process.stdout.rows - (1 + (choices.length - curChoice))
        );
        console.log(
          ` ➔  ${this.colors.cyan}${choices[curChoice]}${this.colors.reset}`
        );
        process.stdout.cursorTo(
          0,
          process.stdout.rows - (1 + (choices.length - curChoice))
        );

        const handleKeypress = async (chunk: any, key: any) => {
          if (!key) return;
          if (chunk) {
          }
          // console.log(key);
          if (key.name === "c" && key.ctrl) process.exit();
          if (key.name === "return") {
            process.stdout.cursorTo(
              0,
              process.stdout.rows - (2 + choices.length)
            );
            console.log(
              `You selected: ${this.colors.cyan}${choices[curChoice]}${
                this.colors.reset
              }${"\u00a0".repeat(70)}\n${`${"\u00a0".repeat(70)}\n`.repeat(
                choices.length
              )}`
            );
            process.stdout.cursorTo(0, process.stdout.rows - 3);
            // process.stdout.end();
            process.stdin.end();
            process.stdin.removeListener("keypress", handleKeypress);
            await resolve(
              this.format(choices[curChoice], format, {
                choices,
                index: curChoice,
              })
            );
          } else {
            if (key.name === "up") {
              if (curChoice != 0) {
                lastChoice = curChoice;
                curChoice -= 1;
              }
            } else if (key.name === "down") {
              if (curChoice != choices.length - 1) {
                lastChoice = curChoice;
                curChoice += 1;
              }
            }
            console.log(` -  ${this.colors.reset}${choices[lastChoice]}`);
            process.stdout.cursorTo(
              0,
              process.stdout.rows - (1 + (choices.length - curChoice))
            );
            console.log(
              ` ➔  ${this.colors.cyan}${choices[curChoice]}${this.colors.reset}`
            );
            process.stdout.cursorTo(
              0,
              process.stdout.rows - (1 + (choices.length - curChoice))
            );
          }
        };

        process.stdin.on("keypress", handleKeypress);
      }
    });
  }
}
