import { format, isLetter, isNumber, isSymbol } from "../index";
import { Colors, InputJsonOutput, InputBoolSettings } from "../../../input";
import readline from "readline";

export class InputBool {
    private input: string[] = [];
    private selected_bool: boolean | undefined;
    private supported: string[] = [
        "yes",
        "no",
        "ja",
        "nein",
        "true",
        "false",
        "y",
        "n",
        "j",
    ]
    private positive: string[] = ["yes", "ja", "true", "y", "j"];
    private settings: InputBoolSettings;
    private resolve: (value: string | InputJsonOutput | PromiseLike<string | InputJsonOutput | null> | null) => void;

    constructor(settings: InputBoolSettings, resolve: (value: string | InputJsonOutput | PromiseLike<string | InputJsonOutput | null> | null) => void) {
        this.settings = settings;
        this.resolve = resolve;
        this.handleKeypress = this.handleKeypress.bind(this);
        if (!this.settings.default_bool) return;
        this.selected_bool = this.settings.default_bool
    }

    public async handleKeypress(chunk: any, key: any) {
        if (!this.settings.format || !this.settings.default_bool) return;
        if (!key) return;
        if (chunk) {
        }
        // console.log(key);
        if (key.name === "c" && key.ctrl) process.exit();
        else if (key.name === "return") {
          if (this.settings.required && this.input.length == 0) this.selected_bool = this.settings.default_bool;
          else if (!this.supported.includes(this.input.join(""))) return;
          readline.cursorTo(process.stdout, 15);
          console.log(
            Colors.foreground.cyan +
              `${
                this.input.length > 0
                  ? this.input.join("")
                  : this.selected_bool
                  ? "true"
                  : "false"
              } ${Colors.reset}`
          );
          await readline.cursorTo(process.stdout, 0);
          process.stdin.removeListener("keypress", this.handleKeypress);

          readline.emitKeypressEvents(process.stdin);

          if (process.stdin.isTTY) process.stdin.setRawMode(true);
          await this.resolve(
            format(
              this.input.length > 0
                ? this.input.join("")
                : `${this.selected_bool ? "true" : "false"}`,
              this.settings.format,
              {
                bool:
                  this.input.length > 0
                    ? this.positive.includes(this.input.join(""))
                      ? true
                      : false
                    : this.selected_bool,
              }
            )
          );
        } else {
          if (key.name === "backspace") {
            this.input.pop();
          } else {
            this.input.push(
              key.sequence
                ? key.sequence
                : key.shift
                ? key.name.toUpperCase()
                : key.name
            );
          }

          readline.cursorTo(process.stdout, 15 + this.input.length - 1);
          process.stdout.write(
            (this.input.length > 0 ? this.input[this.input.length - 1] : "") +
              "\u00a0".repeat(40)
          );
          readline.cursorTo(process.stdout, 15 + this.input.length);
        }
    }
}