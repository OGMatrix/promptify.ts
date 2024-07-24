import { Format, Prompt, Selection } from "../type";
import readline from "readline";
import {
  InputBoolSettings,
  InputDateSettings,
  InputFiledialogSettings,
  InputJsonOutput,
  InputPromptSettings,
  InputPwdSettings,
  InputSelectionSettings,
} from "../interfaces";
import { Design } from "../enums";
import { Colors } from "../variables";
import { Designer } from "./designer";
import { Logger } from "../../logger";
import { Filesystem } from "../../filesystem";
import { InputBool, InputDate, InputFiledialog, InputPrompt, InputPwd, InputSelection } from "../../keypress";

export class Input {
  public VERSION = "0.3.1";
  public AUTHOR = "OGMatrix";
  public ID = "";
  private logger = new Logger();

  constructor() {}

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

    this.logger.print(
      `[${default_bool ? "Y" : "y"}/${default_bool ? "n" : "N"}]? `,
      true
    );
    readline.cursorTo(process.stdout, 15);

    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    return new Promise(async (resolve, reject) => {
      const handle = new InputBool({q, required, default_bool, format, design}, resolve);
      process.stdin.on("keypress", handle.handleKeypress);
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

    this.logger.print(
      `${Colors.foreground.gray}[Press space to show/hide password]`
    );
    this.logger.print(`Password: ${"_".repeat(40)}`, true);
    readline.cursorTo(process.stdout, 18);

    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    return new Promise(async (resolve, reject) => {
      const handle = new InputPwd({q, required, format, design}, resolve)
      process.stdin.on("keypress", handle.handleKeypress);
    });
  }

  async date({
    q,
    startDate = new Date(),
    format = "json",
    design = {
      header: Design.Modern,
      body: Design.Modern,
      colors: {
        box_color: Colors.foreground.white,
        shadow_color: Colors.foreground.gray,
      },
    },
  }: InputDateSettings): Promise<string | InputJsonOutput | null> {
    const designer = new Designer(design, this.logger, this.VERSION, q);

    designer.log_header();

    this.logger.print(
      `${Colors.foreground.gray}[\u2190 go left] [\u2192 go right] [\u2191 increase] [\u2193 decrease] [press enter to select] [CTRL+C to exit]${Colors.reset}`
    );

    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    return new Promise(async (resolve, reject) => {
      const handle = new InputDate({q, startDate, format, design}, resolve);
      this.logger.print(`${handle.formatDate(startDate, 0)}`, true);
      readline.cursorTo(process.stdout, 7);

      readline.emitKeypressEvents(process.stdin);
      process.stdin.on("keypress", handle.handleKeypress);
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

    this.logger.print(`\u00a0\u00a0? ${"_".repeat(40)}`, true);
    readline.cursorTo(process.stdout, 12);

    // if (type === "text") {
      
    // } else if (type === "number") {
    //   this.logger.print(`\u00a0\u00a0? ${"_".repeat(40)}`, true);
    //   readline.cursorTo(process.stdout, 12);
    // } else if (type === "word") {
    //   this.logger.print("Word");
    // } else {
    //   return null;
    // }

    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    return new Promise(async (resolve, reject) => {
      const handle = new InputPrompt({type, q, required, format, design}, resolve);
      process.stdin.on("keypress", handle.handleKeypress);
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
      const handle = new InputSelection({type, choices, q, format, design}, resolve) 
      if (type === "single") {
        process.stdin.on("keypress", handle.handleKeypressSingle);
      }
    });
  }

  async filedialog({
    type,
    q,
    startPath = __dirname,
    extensions = "*",
    showHiddenFolders = false,
    format = "json",
    design = {
      header: Design.Modern,
      body: Design.Modern,
      colors: {
        box_color: Colors.foreground.white,
        shadow_color: Colors.foreground.gray,
      },
    },
  }: InputFiledialogSettings) {
    // GENERAL CONSOLE PRINT :)
    const designer = new Designer(design, this.logger, this.VERSION, q);
    const filesystem = new Filesystem(
      extensions,
      showHiddenFolders,
      type === "file" ? true : false
    );

    designer.log_header();

    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) process.stdin.setRawMode(true);

    // SELECTION METHOD
    return new Promise(async (resolve, reject) => {
      this.logger.print(
        `${Colors.foreground.gray}[\u2190 go back] [\u2192 go into folder] [\u2191 go up] [\u2193 go down] [paste path and press enter] [press enter to select] [CTRL+C to exit]${Colors.reset}`
      );

      const handle = new InputFiledialog({type, q, startPath, extensions, showHiddenFolders, format, design}, resolve, filesystem);

      await handle.startup();

      process.stdin.on("keypress", handle.handleKeypress);
    });
  }
}
