import { format, isLetter, isNumber, isSymbol, isUrl } from "../index";
import { Colors, InputJsonOutput, InputUrlSettings } from "../../../input";
import readline from "readline";

export class UrlPrompt {
  private input: string[] = [];
  private settings: InputUrlSettings;
  private resolve: (
    value:
      | string
      | InputJsonOutput
      | PromiseLike<string | InputJsonOutput | null>
      | null
  ) => void;
  private error: boolean = false;

  constructor(
    settings: InputUrlSettings,
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

    this.handleKeypress = this.handleKeypress.bind(this);
  }

  private async validate(text: string) {
    const val = await isUrl(text, this.settings.protocol ? this.settings.protocol : "http(s)");
    if (!val) {
      this.error = true;
      readline.cursorTo(process.stdout, 12);
      process.stdout.write(
        Colors.foreground.red +
          this.input.join("") +
          "  (Url invalid)" +
          Colors.reset
      );
      readline.cursorTo(process.stdout, 12 + this.input.length);
    }
    return val;
  }

  public async handleKeypress(chunk: any, key: any) {
    if (!this.settings.format) return;
    if (!key) return;
    if (chunk) {
    }
    // console.log(key);
    if (key.name === "c" && key.ctrl) process.exit();
    else if (key.name === "return") {
      const val = await this.validate(this.input.join(""));
      if (this.settings.required && this.input.length == 0) return;
      if (!val || this.error) return;
      readline.cursorTo(process.stdout, 12);
      console.log(
        Colors.foreground.cyan +
          this.input.join("") +
          Colors.reset +
          " ".repeat(40 - this.input.length)
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
          this.error = false;
        }
      }

      readline.cursorTo(process.stdout, 12 + this.input.length - 1);
      process.stdout.write(
        (this.input.length > 0 ? this.input[this.input.length - 1] : "") +
          " " +
          " ".repeat(39 - this.input.length)
      );
      readline.cursorTo(process.stdout, 12 + this.input.length);
    }
  }
}
