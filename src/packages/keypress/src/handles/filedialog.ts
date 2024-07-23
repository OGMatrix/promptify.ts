import { format } from "../index";
import {
  Colors,
  InputJsonOutput,
  InputFiledialogSettings,
} from "../../../input";
import readline from "readline";
import { Logger } from "../../../logger";
import { Filesystem, Item } from "../../../filesystem";

export class InputFiledialog {
  private text: string = ``;
  private settings: InputFiledialogSettings;
  private lastChoice: number = 0;
  private curChoice: number = 0;
  private path: string = "";
  private showFiles: number = 6;
  private index: number = 0;
  private input: string[] = [];
  private logger: Logger = new Logger();
  private filesystem: Filesystem;
  private items: Item[] = [];
  private resolve: (
    value:
      | string
      | InputJsonOutput
      | PromiseLike<string | InputJsonOutput | null>
      | null
  ) => void;

  constructor(
    settings: InputFiledialogSettings,
    resolve: (
      value:
        | string
        | InputJsonOutput
        | PromiseLike<string | InputJsonOutput | null>
        | null
    ) => void,
    filesystem: Filesystem
  ) {
    this.settings = settings;
    this.resolve = resolve;
    this.filesystem = filesystem;
    if (!this.settings.startPath) return;
    this.path = this.filesystem.getPath(this.settings.startPath);

    this.text = `${Colors.foreground.gray}${this.path}${"\u00a0".repeat(40)}\n`;
    this.handleKeypress = this.handleKeypress.bind(this);
  }

  public async startup() {
    this.items = await this.filesystem.getContentByLocation(this.path);

    for (
      let i = 0;
      i < (this.items.length < this.showFiles ? this.items.length : this.showFiles);
      i++
    ) {
      if (i == 0)
        this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${
          Colors.foreground.cyan
        }${this.items[i].type === "folder" ? "  \u{1F4C1}" : "    "} ${
          this.items[i].name
        }${Colors.reset}\n`;
      else
        this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${
          this.items[i].type === "folder" ? "  \u{1F4C1}" : "    "
        } ${this.items[i].name}\n`;
    }

    if (this.items.length < this.showFiles) {
      if (this.items.length == 0) {
        for (let i = 0; i < this.showFiles - this.items.length - 1; i++) {
          this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${"\u00a0".repeat(
            30
          )}\n`;
        }
      } else {
        for (let i = 0; i < this.showFiles - this.items.length; i++) {
          this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${"\u00a0".repeat(
            30
          )}\n`;
        }
      }
    }

    this.logger.print(this.text + `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t`, true);
    this.text = ``;
  }

  public async handleKeypress(chunk: any, key: any) {
    if (!this.settings.format) return;
    if (!key) return;
    if (chunk) {
    }
    // console.log(key);
    if (key.name === "c" && key.ctrl) process.exit();
    else if (key.name === "return") {
      if (this.input.length > 0) {
        this.path = this.filesystem.getPath(this.input.join(""));
        this.input = [];
        this.curChoice = 0;

        this.items = await this.filesystem.getContentByLocation(this.path);
        this.text = `${Colors.foreground.gray}${this.path}${"\u00a0".repeat(40)}\n`;
        if (this.items.length == 0) {
          this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\tNo content found. ${Colors.foreground.gray}[Press backspace to go back]\n`;
        } else {
          for (
            let i = 0;
            i < (this.items.length < this.showFiles ? this.items.length : this.showFiles);
            i++
          ) {
            if (i == 0)
              this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${
                Colors.foreground.cyan
              }${this.items[i].type === "folder" ? "  \u{1F4C1}" : "    "} ${
                this.items[i].name
              }${"\u00a0".repeat(40)}${Colors.reset}\n`;
            else
              this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${
                this.items[i].type === "folder" ? "  \u{1F4C1}" : "    "
              } ${this.items[i].name}${"\u00a0".repeat(40)}\n`;
          }
        }

        if (this.items.length < this.showFiles) {
          if (this.items.length == 0) {
            for (let i = 0; i < this.showFiles - this.items.length - 1; i++) {
              this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${"\u00a0".repeat(
                30
              )}\n`;
            }
          } else {
            for (let i = 0; i < this.showFiles - this.items.length; i++) {
              this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${"\u00a0".repeat(
                30
              )}\n`;
            }
          }
        }

        process.stdout.clearLine(0);
        process.stdout.write(
          "\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A"
        );
        readline.cursorTo(process.stdout, 0);
        this.logger.print(
          this.text + `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${this.input.join("")}`,
          true
        );
        this.text = ``;
      } else {
        // readline.cursorTo(process.stdout, 0, pos.y - (offset + choices.length));
        this.path = this.filesystem.go(this.path, this.items[this.curChoice].name);
        this.text = ``;
        this.text = `You selected: ${Colors.foreground.cyan}${this.path}${
          Colors.reset
        }${"\u00a0".repeat(70)}\n${`\x1b[30m\x1b[46m\u2B2A${
          Colors.reset
        }${"\u00a0".repeat(70)}\n`.repeat(6)}`;

        process.stdout.clearLine(0);
        process.stdout.write(
          "\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A"
        );
        process.stdout.write(this.text);
        process.stdout.clearLine(0);
        process.stdout.write("\x1B[1A\x1B[1A");
        // process.stdout.end();
        process.stdin.removeListener("keypress", this.handleKeypress);
        await this.resolve(format(this.path, this.settings.format));
      }
    } else if (key.name === "right") {
      if (this.items[this.curChoice].type === "folder") {
        this.path = this.filesystem.go(this.path, this.items[this.curChoice].name);
        this.curChoice = 0;

        this.items = await this.filesystem.getContentByLocation(this.path);
        this.text = `${Colors.foreground.gray}${this.path}${"\u00a0".repeat(40)}\n`;
        if (this.items.length == 0) {
          this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\tNo content found. ${Colors.foreground.gray}[Press backspace to go back]\n`;
        } else {
          for (
            let i = 0;
            i < (this.items.length < this.showFiles ? this.items.length : this.showFiles);
            i++
          ) {
            if (i == 0)
              this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${
                Colors.foreground.cyan
              }${this.items[i].type === "folder" ? "  \u{1F4C1}" : "    "} ${
                this.items[i].name
              }${"\u00a0".repeat(40)}${Colors.reset}\n`;
            else
              this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${
                this.items[i].type === "folder" ? "  \u{1F4C1}" : "    "
              } ${this.items[i].name}${"\u00a0".repeat(40)}\n`;
          }
        }

        if (this.items.length < this.showFiles) {
          if (this.items.length == 0) {
            for (let i = 0; i < this.showFiles - this.items.length - 1; i++) {
              this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${"\u00a0".repeat(
                30
              )}\n`;
            }
          } else {
            for (let i = 0; i < this.showFiles - this.items.length; i++) {
              this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${"\u00a0".repeat(
                30
              )}\n`;
            }
          }
        }

        process.stdout.clearLine(0);
        process.stdout.write(
          "\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A"
        );
        readline.cursorTo(process.stdout, 0);
        this.logger.print(
          this.text + `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${this.input.join("")}`,
          true
        );
        this.text = ``;
      }
    } else if (key.name === "left") {
      this.path = this.filesystem.back(this.path);
      this.curChoice = 0;

      this.items = await this.filesystem.getContentByLocation(this.path);
      this.text = `${Colors.foreground.gray}${this.path}${"\u00a0".repeat(40)}\n`;
      if (this.items.length == 0) {
        this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\tNo content found. ${Colors.foreground.gray}[Press backspace to go back]\n`;
      } else {
        for (
          let i = 0;
          i < (this.items.length < this.showFiles ? this.items.length : this.showFiles);
          i++
        ) {
          if (i == 0)
            this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${
              Colors.foreground.cyan
            }${this.items[i].type === "folder" ? "  \u{1F4C1}" : "    "} ${
              this.items[i].name
            }${"\u00a0".repeat(40)}${Colors.reset}\n`;
          else
            this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${
              this.items[i].type === "folder" ? "  \u{1F4C1}" : "    "
            } ${this.items[i].name}${"\u00a0".repeat(40)}\n`;
        }
      }

      if (this.items.length < this.showFiles) {
        for (let i = 0; i < this.showFiles - this.items.length; i++) {
          this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${"\u00a0".repeat(
            30
          )}\n`;
        }
      }

      process.stdout.clearLine(0);
      process.stdout.write("\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A");
      readline.cursorTo(process.stdout, 0);
      this.logger.print(
        this.text + `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${this.input.join("")}`,
        true
      );
      this.text = ``;
    } else {
      if (key.name ? key.name.length == 1 : key.sequence.length == 1) {
        this.input.push(
          key.sequence
            ? key.sequence
            : key.shift
            ? key.name.toUpperCase()
            : key.name
        );

        this.text = `${Colors.foreground.gray}${this.path}${"\u00a0".repeat(40)}\n`;
        if (this.items.length == 0) {
          this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\tNo content found. ${Colors.foreground.gray}[Press backspace to go back]\n`;
        } else {
          for (
            let i = 0;
            i < (this.items.length < this.showFiles ? this.items.length : this.showFiles);
            i++
          ) {
            if (i == 0)
              this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${
                Colors.foreground.cyan
              }${this.items[i].type === "folder" ? "  \u{1F4C1}" : "    "} ${
                this.items[i].name
              }${"\u00a0".repeat(40)}${Colors.reset}\n`;
            else
              this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${
                this.items[i].type === "folder" ? "  \u{1F4C1}" : "    "
              } ${this.items[i].name}${"\u00a0".repeat(40)}\n`;
          }
        }

        if (this.items.length < this.showFiles) {
          for (let i = 0; i < this.showFiles - this.items.length; i++) {
            this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${"\u00a0".repeat(
              30
            )}\n`;
          }
        }

        process.stdout.clearLine(0);
        process.stdout.write(
          "\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A"
        );
        readline.cursorTo(process.stdout, 0);
        this.logger.print(
          this.text + `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${this.input.join("")}`,
          true
        );
        this.text = ``;
      } else if (key.name === "up") {
        if (this.items.length == 0) return;
        if (this.curChoice != 0) {
          this.lastChoice = this.curChoice;
          this.curChoice -= 1;
          if (this.curChoice > this.showFiles) {
            let offset = 5;

            this.text = `${Colors.foreground.gray}${this.path}${"\u00a0".repeat(
              40
            )}\n`;
            for (
              let i = 0;
              i < (this.items.length < this.showFiles ? this.items.length : this.showFiles);
              i++
            ) {
              if (this.curChoice == i + offset)
                this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${
                  Colors.foreground.cyan
                }${
                  this.items[i + offset].type === "folder" ? "  \u{1F4C1}" : "    "
                } ${this.items[i + offset].name}${"\u00a0".repeat(40)}${
                  Colors.reset
                }\n`;
              else
                this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${
                  this.items[i + offset].type === "folder" ? "  \u{1F4C1}" : "    "
                } ${this.items[i + offset].name}${"\u00a0".repeat(40)}\n`;
            }

            process.stdout.clearLine(0);
            process.stdout.write(
              "\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A"
            );
            readline.cursorTo(process.stdout, 0);
            this.logger.print(
              this.text + `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${this.input.join("")}`,
              true
            );
            this.text = ``;
          } else {
            if (this.curChoice + 1 < this.showFiles) this.index -= 1;

            let offset =
              this.curChoice + 1 > this.showFiles ? this.curChoice + 1 - this.showFiles : 0;

            this.text = `${Colors.foreground.gray}${this.path}${"\u00a0".repeat(
              40
            )}\n`;
            for (
              let i = 0;
              i < (this.items.length < this.showFiles ? this.items.length : this.showFiles);
              i++
            ) {
              if (this.curChoice == i + offset)
                this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${
                  Colors.foreground.cyan
                }${
                  this.items[i + offset].type === "folder" ? "  \u{1F4C1}" : "    "
                } ${this.items[i + offset].name}${"\u00a0".repeat(40)}${
                  Colors.reset
                }\n`;
              else
                this.text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${
                  this.items[i + offset].type === "folder" ? "  \u{1F4C1}" : "    "
                } ${this.items[i + offset].name}${"\u00a0".repeat(40)}\n`;
            }

            if (this.items.length < this.showFiles) {
              for (let i = 0; i < this.showFiles - this.items.length; i++) {
                this.text += `\x1b[30m\x1b[46m\u2B2A${
                  Colors.reset
                }\t${"\u00a0".repeat(30)}\n`;
              }
            }

            process.stdout.clearLine(0);
            process.stdout.write(
              "\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A"
            );
            readline.cursorTo(process.stdout, 0);
            this.logger.print(
              this.text + `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${this.input.join("")}`,
              true
            );
            this.text = ``;
          }
        }
      } else if (key.name === "down") {
        if (this.items.length == 0) return;
        if (this.curChoice != this.items.length - 1) {
          this.lastChoice = this.curChoice;
          this.curChoice += 1;
          if (this.curChoice < this.showFiles) this.index += 1;
          let offset =
            this.curChoice + 1 > this.showFiles ? this.curChoice + 1 - this.showFiles : 0;

          let text = `${Colors.foreground.gray}${this.path}${"\u00a0".repeat(40)}\n`;
          for (
            let i = 0;
            i < (this.items.length < this.showFiles ? this.items.length : this.showFiles);
            i++
          ) {
            if (this.curChoice == i + offset)
              text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${
                Colors.foreground.cyan
              }${
                this.items[i + offset].type === "folder" ? "  \u{1F4C1}" : "    "
              } ${this.items[i + offset].name}${"\u00a0".repeat(40)}${
                Colors.reset
              }\n`;
            else
              text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${
                this.items[i + offset].type === "folder" ? "  \u{1F4C1}" : "    "
              } ${this.items[i + offset].name}${"\u00a0".repeat(40)}\n`;
          }

          if (this.items.length < this.showFiles) {
            for (let i = 0; i < this.showFiles - this.items.length; i++) {
              text += `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${"\u00a0".repeat(
                30
              )}\n`;
            }
          }

          process.stdout.clearLine(0);
          process.stdout.write(
            "\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A\x1B[1A"
          );
          readline.cursorTo(process.stdout, 0);
          this.logger.print(
            text + `\x1b[30m\x1b[46m\u2B2A${Colors.reset}\t${this.input.join("")}`,
            true
          );
          text = ``;
        }
      }
    }
  }
}
