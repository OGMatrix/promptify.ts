import { format, isLetter, isNumber, isSymbol } from "../index";
import { Colors, InputJsonOutput, InputPromptSettings } from "../../../input";
import readline from "readline";

export class InputPrompt {
    private input: string[] = [];
    private settings: InputPromptSettings;
    private resolve: (value: string | InputJsonOutput | PromiseLike<string | InputJsonOutput | null> | null) => void;

    constructor(settings: InputPromptSettings, resolve: (value: string | InputJsonOutput | PromiseLike<string | InputJsonOutput | null> | null) => void) {
        this.settings = settings;
        this.resolve = resolve;
        
        this.handleKeypress = this.handleKeypress.bind(this);
    }

    public async handleKeypress(chunk: any, key: any) {
        if (!this.settings.format) return;
        if (!key) return;
        if (chunk) {
        }
        // console.log(key);
        if (key.name === "c" && key.ctrl) process.exit();
        else if (key.name === "return") {
          if (this.settings.required && this.input.length == 0) return;
          readline.cursorTo(process.stdout, 12);
          console.log(
            Colors.foreground.cyan +
              this.input.join("") +
              Colors.reset +
              "_".repeat(40 - this.input.length)
          );
          await readline.cursorTo(process.stdout, 0);
          process.stdin.removeListener("keypress", this.handleKeypress);

          readline.emitKeypressEvents(process.stdin);

          if (process.stdin.isTTY) process.stdin.setRawMode(true);
          await this.resolve(format(this.input.join(""), this.settings.format));
        } else {
          if (key.name === "backspace") {
            this.input.pop();
          } else if (key.name === "space") this.input.push(" ");
          else {
            if (
              this.settings.type === "text" &&
              (key.name ? key.name.length == 1 : key.sequence.length == 1) &&
              (isLetter(key.name) ||
                isNumber(key.name) ||
                (key.sequence ? isSymbol(key.sequence) : false))
            ) {
              this.input.push(
                key.sequence
                  ? key.sequence
                  : key.shift
                  ? key.name.toUpperCase()
                  : key.name
              );
            } else if (this.settings.type === "number" && isNumber(key.name)) {
              this.input.push(key.name);
            } else if (this.settings.type === "word") {
              console.log("Word");
            }
          }
          readline.cursorTo(process.stdout, 12 + this.input.length - 1);
          process.stdout.write(
            (this.input.length > 0 ? this.input[this.input.length - 1] : "") +
              " " +
              "_".repeat(39 - this.input.length)
          );
          readline.cursorTo(process.stdout, 12 + this.input.length);
        }
      };
}