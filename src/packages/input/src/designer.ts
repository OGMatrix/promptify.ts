import { Logger } from "../../logger";
import { Design } from "../enums";
import { InputPromptDesignSettings } from "../interfaces";
import { Colors } from "../variables";

export class Designer {
  private design: InputPromptDesignSettings;
  private logger: Logger;
  private v: string;
  private q: string;
  private colors = Colors;

  constructor(
    design: InputPromptDesignSettings,
    logger: Logger,
    v: string,
    q: string
  ) {
    this.design = design;
    this.logger = logger;
    this.v = v;
    this.q = q;
  }

  log_header() {
    switch (this.design.header) {
      case Design.Modern:
        const questionText = `🚀  ${this.q}`;
        const padding = Math.max(43 - questionText.length, 0);
        const paddingLeft = Math.floor(padding / 2);
        const paddingRight = padding - paddingLeft;
        const text =
          "\u00a0".repeat(paddingLeft) +
          this.colors.foreground.cyan +
          questionText +
          this.colors.reset +
          "\u00a0".repeat(paddingRight);

        this.logger.print("   ");
        this.logger.print(
          `${this.design.colors.box_color}┌───────────────────────────────────────────┐`
        );
        this.logger.print(
          `${this.design.colors.box_color}│${"\u00a0".repeat(43)}│${
            this.design.colors.shadow_color
          }░`
        );
        this.logger.print(
          `${this.design.colors.box_color}│${"\u00a0".repeat(43)}│${
            this.design.colors.shadow_color
          }░`
        );
        this.logger.print(
          `${this.design.colors.box_color}│${this.colors.reset}${text}${this.design.colors.box_color}│${this.colors.reset}${this.design.colors.shadow_color}░`
        );
        this.logger.print(
          `${this.design.colors.box_color}│${"\u00a0".repeat(43)}│${
            this.design.colors.shadow_color
          }░`
        );
        this.logger.print(
          `${this.design.colors.box_color}│                                   ${this.colors.reset}${this.colors.foreground.white}V${this.v}  ${this.design.colors.box_color}│${this.design.colors.shadow_color}░`
        );
        this.logger.print(
          `${this.design.colors.box_color}└───────────────────────────────────────────┘${this.design.colors.shadow_color}░`
        );
        this.logger.print(
          `${this.design.colors.shadow_color}  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░${this.colors.reset}`
        );
        this.logger.print("   ");
        this.logger.print("   ");
        break;
    }
  }

  async get_current_position(): Promise<any> {
    return new Promise((resolve) => {
        const termcodes = { cursorGetPosition: '\u001b[6n' };
    
        process.stdin.setEncoding('utf8');
        process.stdin.setRawMode(true);
    
        const readfx = function () {
            const buf = process.stdin.read();
            const str = JSON.stringify(buf); // "\u001b[9;1R"
            const regex = /\[(.*)/g;
            const reg = regex.exec(str)
            if (reg) {
                const xy = reg[0].replace(/\[|R"/g, '').split(';');
                const pos = { y: xy[0], x: xy[1] };
                process.stdin.setRawMode(false);
                resolve(pos);
            }
        }
    
        process.stdin.once('readable', readfx);
        process.stdout.write(termcodes.cursorGetPosition);
    })
  }
}
