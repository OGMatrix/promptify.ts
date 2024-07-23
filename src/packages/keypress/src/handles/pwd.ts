import { format, isLetter, isNumber, isSymbol } from "../index";
import { Colors, InputJsonOutput, InputPwdSettings } from "../../../input";
import readline from "readline";

export class InputPwd {
    private input: string[] = [];
    private showPwd: boolean = false;
    private settings: InputPwdSettings;
    private resolve: (value: string | InputJsonOutput | PromiseLike<string | InputJsonOutput | null> | null) => void;

    constructor(settings: InputPwdSettings, resolve: (value: string | InputJsonOutput | PromiseLike<string | InputJsonOutput | null> | null) => void) {
        this.settings = settings;
        this.resolve = resolve;
        this.handleKeypress = this.handleKeypress.bind(this);
    }

    async handleKeypress(chunk: any, key: any) {
        if (!this.settings.format) return;
        if (!key) return;
        if (chunk) {
        }
        // console.log(key);
        if (key.name === "c" && key.ctrl) process.exit();
        else if (key.name === "return") {
          if (this.settings.required && this.input.length == 0) return;
          readline.cursorTo(process.stdout, 18);
          console.log(
            Colors.foreground.cyan +
              (this.showPwd ? this.input.join("") : "*".repeat(this.input.length)) +
              Colors.reset +
              "_".repeat(40 - this.input.length)
          );
          await readline.cursorTo(process.stdout, 0);
          process.stdin.removeListener("keypress", this.handleKeypress);
          readline.emitKeypressEvents(process.stdin);

          if (process.stdin.isTTY) process.stdin.setRawMode(true);
          await this.resolve(format(this.input.join(""), this.settings.format));
        } else if (key.name === "space") {
          this.showPwd = !this.showPwd;
          readline.cursorTo(process.stdout, 18);
          process.stdout.write(
            (this.showPwd ? this.input.join("") : "*".repeat(this.input.length)) +
              Colors.reset +
              "_".repeat(40 - this.input.length)
          );
          readline.cursorTo(process.stdout, 18 + this.input.length);
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

          readline.cursorTo(process.stdout, 18 + this.input.length - 1);
          process.stdout.write(
            (this.input.length > 0
              ? this.showPwd
                ? this.input[this.input.length - 1]
                : "*"
              : "") +
              " " +
              "_".repeat(39 - this.input.length)
          );
          readline.cursorTo(process.stdout, 18 + this.input.length);
        }
    }
}