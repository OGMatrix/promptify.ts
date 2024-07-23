import { format, isLetter, isNumber, isSymbol } from "../index";
import {
  Colors,
  InputJsonOutput,
  InputSelectionSettings,
} from "../../../input";
import readline from "readline";
import { Logger } from "../../../logger";

export class InputSelection {
  private text: string = ``;
  private settings: InputSelectionSettings;
  private lastChoice: number = 0;
  private curChoice: number = 0;
  private logger: Logger = new Logger();
  private resolve: (
    value:
      | string
      | InputJsonOutput
      | PromiseLike<string | InputJsonOutput | null>
      | null
  ) => void;

  constructor(
    settings: InputSelectionSettings,
    resolve: (
      value:
        | string
        | InputJsonOutput
        | PromiseLike<string | InputJsonOutput | null>
        | null
    ) => void
  ) {
    this.settings = settings;
    this.resolve = resolve;
    this.handleKeypressSingle = this.handleKeypressSingle.bind(this);

    if (this.settings.type === "single") {
      this.logger.print(
        `${Colors.foreground.gray}[Press enter to choose selected choice or CTRL+C to exit]${Colors.reset}`
      );

      for (let i = 0; i < this.settings.choices.length; i++) {
        if (this.curChoice == i)
          this.text += ` ➔  ${Colors.foreground.cyan}${this.settings.choices[i]}${Colors.reset}\n`;
        else
          this.text += `${
            i > 0 ? `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t` : ""
          } -  ${this.settings.choices[i]}\n`;
      }

      this.logger.print(this.text, true);
      this.text = ``;
    }
  }

  public async handleKeypressSingle(chunk: any, key: any) {
    if (!this.settings.format) return;
    if (!key) return;
    if (chunk) {
    }
    // console.log(key);
    if (key.name === "c" && key.ctrl) process.exit();
    if (key.name === "return") {
      // readline.cursorTo(process.stdout, 0, pos.y - (offset + choices.length));
      this.text = `You selected: ${Colors.foreground.cyan}${
        this.settings.choices[this.curChoice]
      }${Colors.reset}${"\u00a0".repeat(70)}\n${`${"\u00a0".repeat(
        70
      )}\n`.repeat(1)}`;

      process.stdout.clearLine(0);
      process.stdout.write("\x1B[1A\x1B[1A");
      this.logger.print(this.text);
      // process.stdout.end();
      process.stdin.removeListener("keypress", this.handleKeypressSingle);
      await this.resolve(
        format(this.settings.choices[this.curChoice], this.settings.format, {
          choices: this.settings.choices,
          index: this.curChoice,
        })
      );
    } else {
      if (key.name === "up") {
        if (this.curChoice != 0) {
          this.lastChoice = this.curChoice;
          this.curChoice -= 1;
        }
      } else if (key.name === "down") {
        if (this.curChoice != this.settings.choices.length - 1) {
          this.lastChoice = this.curChoice;
          this.curChoice += 1;
        }
      }

      this.text = ``;
      for (let i = 0; i < this.settings.choices.length; i++) {
        if (this.curChoice == i)
          this.text += `${
            i > 0 ? `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t` : ""
          } ➔  ${Colors.foreground.cyan}${this.settings.choices[i]}${Colors.reset}\n`;
        else
          this.text += `${
            i > 0 ? `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t` : ""
          } -  ${this.settings.choices[i]}\n`;
      }

      process.stdout.clearLine(0);
      process.stdout.write("\x1B[1A\x1B[1A");
      this.logger.print(this.text, true);
      this.text = ``;
    }
  }
}
