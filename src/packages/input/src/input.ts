import readline from "readline";
import { Format, Prompt, Selection } from "../type";
import {
  InputBoolSettings,
  InputJsonOutput,
  InputPromptSettings,
  InputPwdSettings,
  InputSelectionSettings,
} from "../interfaces";
import { Design } from "../enums";
import { Colors } from "../variables";
import { Designer } from "./designer";
import { Logger } from "../../logger";

export class Input {
  public VERSION = "0.2.3";
  public AUTHOR = "OGMatrix";
  public ID = "";
  private colors = {
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    reset: "\x1b[0m",
  };
  private logger = new Logger();

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

  async bool({
    q,
    required = true,
    default_bool = true,
    format = "json",
    design = {
      header: Design.Modern,
      body: Design.Modern,
      colors: {
        box_color: Colors.foreground.white,
        shadow_color: Colors.foreground.gray,
      },
    },
  }: InputBoolSettings): Promise<string | InputJsonOutput | null> {
    const designer = new Designer(design, this.logger, this.VERSION, q);

    designer.log_header();

    this.logger.print(`[${default_bool ? 'Y' : 'y'}/${default_bool ? 'n' : 'N'}]? `, true);
    process.stdout.cursorTo(15);

    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    return new Promise(async (resolve, reject) => {
      let input: string[] = [];
      let selected_bool: boolean = default_bool;
      const supported = ["yes", "no", "ja", "nein", "true", "false", "y", "n", "j"]
      const positive = ["yes", "ja", "true", "y", "j"]
      const negative = ["no", "nein", "false", "n"]

      const handleKeypress = async (chunk: any, key: any) => {
        if (!key) return;
        if (chunk) {
        }
        // console.log(key);
        if (key.name === "c" && key.ctrl) process.exit();
        else if (key.name === "return") {
          if (required && input.length == 0) selected_bool = default_bool;
          else if (!supported.includes(input.join(""))) return;
          process.stdout.cursorTo(15);
          console.log(this.colors.cyan + `${input.length > 0 ? input.join("") : (selected_bool ? 'true' : 'false')} ${Colors.reset}`);
          await process.stdout.cursorTo(0);
          process.stdin.end();
          process.stdin.removeListener("keypress", handleKeypress);
          await resolve(this.format(input.length > 0 ? input.join("") : `${selected_bool ? 'true' : 'false'}`, format, {bool: input.length > 0 ? (positive.includes(input.join("")) ? true : false) : selected_bool}));
        } else {
          if (key.name === "backspace") {
            input.pop();
          } else {
            input.push(
              key.sequence
                ? key.sequence
                : key.shift
                ? key.name.toUpperCase()
                : key.name
            );
          }

          process.stdout.cursorTo(15 + input.length - 1);
          process.stdout.write(
            (input.length > 0
              ? input[input.length - 1]
              : "")
              + "\u00a0".repeat(40)
          );
          process.stdout.cursorTo(15 + input.length);
        }
      };
      process.stdin.on("keypress", handleKeypress);
    });
  }

  async pwd({
    q,
    required = true,
    format = "json",
    design = {
      header: Design.Modern,
      body: Design.Modern,
      colors: {
        box_color: Colors.foreground.white,
        shadow_color: Colors.foreground.gray,
      },
    },
  }: InputPwdSettings): Promise<string | InputJsonOutput | null> {
    const designer = new Designer(design, this.logger, this.VERSION, q);

    designer.log_header();

    this.logger.print(`${Colors.foreground.gray}[Press space to show/hide password]`)
    this.logger.print(`Password: ${"_".repeat(40)}`, true);
    process.stdout.cursorTo(18);

    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    return new Promise(async (resolve, reject) => {
      let input: string[] = [];
      let showPwd: boolean = false;

      const handleKeypress = async (chunk: any, key: any) => {
        if (!key) return;
        if (chunk) {
        }
        // console.log(key);
        if (key.name === "c" && key.ctrl) process.exit();
        else if (key.name === "return") {
          if (required && input.length == 0) return;
          process.stdout.cursorTo(18);
          console.log(
            this.colors.cyan + (showPwd
              ? input.join("")
              : "*".repeat(input.length)) +
                  this.colors.reset +
                  "_".repeat(40 - input.length)
          );
          await process.stdout.cursorTo(0);
          process.stdin.end();
          process.stdin.removeListener("keypress", handleKeypress);
          await resolve(this.format(input.join(""), format));
        } else if (key.name === "space") {
          showPwd = !showPwd;
          process.stdout.cursorTo(18);
          process.stdout.write(
            (showPwd
              ? input.join("")
              : "*".repeat(input.length)) +
                  this.colors.reset +
                  "_".repeat(40 - input.length)
          );
          process.stdout.cursorTo(18 + input.length);
        } else {
          if (key.name === "backspace") {
            input.pop();
          } else {
            input.push(
              key.sequence
                ? key.sequence
                : key.shift
                ? key.name.toUpperCase()
                : key.name
            );
          }

          process.stdout.cursorTo(18 + input.length - 1);
          process.stdout.write(
            (input.length > 0
              ? showPwd
                ? input[input.length - 1]
                : "*"
              : "") +
              " " +
              "_".repeat(39 - input.length)
          );
          process.stdout.cursorTo(18 + input.length);
        }
      };
      process.stdin.on("keypress", handleKeypress);
    });
  }

  async prompt({
    type,
    q,
    required = true,
    format = "json",
    design = {
      header: Design.Modern,
      body: Design.Modern,
      colors: {
        box_color: Colors.foreground.white,
        shadow_color: Colors.foreground.gray,
      },
    },
  }: InputPromptSettings): Promise<string | InputJsonOutput | null> {
    const designer = new Designer(design, this.logger, this.VERSION, q);

    designer.log_header();

    if (type === "text") {
      this.logger.print(`\u00a0\u00a0? ${"_".repeat(40)}`, true);
      process.stdout.cursorTo(12);
    } else if (type === "number") {
      this.logger.print(`\u00a0\u00a0? ${"_".repeat(40)}`, true);
      process.stdout.cursorTo(12);
    } else if (type === "word") {
      this.logger.print("Word");
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
          if (required && input.length == 0) return
          process.stdout.cursorTo(12);
          console.log(
            this.colors.cyan +
              input.join("") +
              this.colors.reset +
              "_".repeat(40 - input.length)
          );
          await process.stdout.cursorTo(0);
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
              input.push(
                key.sequence
                  ? key.sequence
                  : key.shift
                  ? key.name.toUpperCase()
                  : key.name
              );
            } else if (type === "number" && this.isNumber(key.name)) {
              input.push(key.name);
            } else if (type === "word") {
              console.log("Word");
            }
          }
          process.stdout.cursorTo(12 + input.length - 1);
          process.stdout.write(
            (input.length > 0 ? input[input.length - 1] : "") +
              " " +
              "_".repeat(39 - input.length)
          )
          process.stdout.cursorTo(12 + input.length);
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
    design = {
      header: Design.Modern,
      body: Design.Modern,
      colors: {
        box_color: Colors.foreground.white,
        shadow_color: Colors.foreground.gray,
      },
    },
  }: InputSelectionSettings) {
    // GENERAL CONSOLE PRINT :)
    const designer = new Designer(design, this.logger, this.VERSION, q);

    designer.log_header();

    const pos = await designer.get_current_position();

    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) process.stdin.setRawMode(true);

    // SELECTION METHOD
    return new Promise(async (resolve, reject) => {
      if (type === "single") {
        let lastChoice = 0;
        let curChoice = 0;
        this.logger.print(
          `${Colors.foreground.gray}[Press enter to choose selected choice or CTRL+C to exit]${Colors.reset}`
        );

        let text = ``

        for (let i = 0; i < choices.length; i++) {
          if (curChoice == i) text += ` ➔  ${this.colors.cyan}${choices[i]}${this.colors.reset}\n`;
          else text += `${i > 0 ? `\x1b[30m\x1b[46m\u2B2A${this.colors.reset}\t` : ''} -  ${choices[i]}\n`;
        }

        this.logger.print(text, true);
        text = ``

        const handleKeypress = async (chunk: any, key: any) => {
          if (!key) return;
          if (chunk) {
          }
          // console.log(key);
          if (key.name === "c" && key.ctrl) process.exit();
          if (key.name === "return") {
            // process.stdout.cursorTo(0, pos.y - (offset + choices.length));
            text = `You selected: ${this.colors.cyan}${choices[curChoice]}${
                this.colors.reset
              }${"\u00a0".repeat(70)}\n${`${"\u00a0".repeat(70)}\n`.repeat(
                1
            )}`

            process.stdout.clearLine(0);
            process.stdout.write("\x1B[1A\x1B[1A");
            this.logger.print(
              text
            );
            // process.stdout.end();
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

            text = ``
            for (let i = 0; i < choices.length; i++) {
              if (curChoice == i) text += `${i > 0 ? `\x1b[30m\x1b[46m\u2B2A${this.colors.reset}\t` : ''} ➔  ${this.colors.cyan}${choices[i]}${this.colors.reset}\n`;
              else text += `${i > 0 ? `\x1b[30m\x1b[46m\u2B2A${this.colors.reset}\t` : ''} -  ${choices[i]}\n`;
            }

            process.stdout.clearLine(0);
            process.stdout.write("\x1B[1A\x1B[1A");
            this.logger.print(text, true);
            text = ``
          }
        };

        process.stdin.on("keypress", handleKeypress);
      }
    });
  }
}
