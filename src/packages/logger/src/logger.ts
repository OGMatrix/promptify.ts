export class Logger {
  private colors = {
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    reset: "\x1b[0m",
  };

  constructor() {}

  print(message: string, updateable: boolean = false): void {
    try {
      process.stdout.write(`\x1b[30m\x1b[46m\u2B2A${this.colors.reset}\t${message}${updateable ? '' : '\n'}`);
    } catch (error) {
      console.error('Error loading SVG:', error);
    }
  }

  test() {
    const q = "Test"
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

    this.print("┌───────────────────────────────────────────┐");
    this.print(`│${"\u00a0".repeat(43)}│░`);
    this.print(`│${"\u00a0".repeat(43)}│░`);
    this.print(`│${text}│░`);
    this.print(`│${"\u00a0".repeat(43)}│░`);
    this.print(`│                                   V0.0.1  │░`);
    this.print("\x1b[90m└───────────────────────────────────────────┘░" + this.colors.reset);
    this.print("\x1b[90m  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░" + this.colors.reset)
  }
}