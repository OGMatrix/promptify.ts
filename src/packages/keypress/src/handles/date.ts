import { format } from "../index";
import { Colors, InputJsonOutput, InputDateSettings } from "../../../input";
import readline from "readline";
import { DateData } from "../interfaces";

export class InputDate {
  private date: Date = new Date();
  private settings: InputDateSettings;
  private editMode = 0;
  private dateData: DateData = {
    day: 0,
    month: 0,
    year: 0,
    maxDay: 0,
    maxYear: 3000,
    maxMonth: 12,
  };
  private resolve: (
    value:
      | string
      | InputJsonOutput
      | PromiseLike<string | InputJsonOutput | null>
      | null
  ) => void;

  constructor(
    settings: InputDateSettings,
    resolve: (
      value:
        | string
        | InputJsonOutput
        | PromiseLike<string | InputJsonOutput | null>
        | null
    ) => void
  ) {
    this.settings = settings;
    if (this.settings.startDate) {
      this.date = new Date(this.settings.startDate);
      this.dateData = {
        day: this.date.getDate(),
        month: this.date.getMonth(),
        year: this.date.getFullYear(),
        maxDay: new Date(
          this.date.getFullYear(),
          this.date.getMonth() + 1,
          0
        ).getDate(),
        maxMonth: 12,
        maxYear: 3000,
      };
    }
    this.resolve = resolve;
    this.handleKeypress = this.handleKeypress.bind(this);
  }

  public async handleKeypress(chunk: any, key: any) {
    if (!this.settings.format) return;
    if (!key) return;
    if (key.name === "c" && key.ctrl) process.exit();
    else if (key.name === "return") {
      readline.cursorTo(process.stdout, 7);
      console.log(
        " " + Colors.foreground.cyan + this.formatDate(this.date, 3) + Colors.reset
      );
      await readline.cursorTo(process.stdout, 0);
      process.stdin.removeListener("keypress", this.handleKeypress);

      readline.emitKeypressEvents(process.stdin);

      if (process.stdin.isTTY) process.stdin.setRawMode(true);
      await this.resolve(
        format(this.formatDate(this.date, 3), this.settings.format, {
          date: this.date,
        })
      );
    } else {
      if (key.name === "left" && this.editMode > 0) {
        this.editMode -= 1;
        await this.print();
      }
      else if (key.name === "right" && this.editMode < 2) {
        this.editMode += 1;
        await this.print();
      }
      else if (key.name === "up") {
        switch (this.editMode) {
          case 0:
            if (this.dateData.day < this.dateData.maxDay)
              this.dateData.day += 1;
            await this.print();
            break;
          case 1:
            if (this.dateData.month < this.dateData.maxMonth - 1) {
              this.dateData.month += 1;
              this.dateData.maxDay = new Date(
                this.dateData.year,
                this.dateData.month + 1,
                0
              ).getDate();
            }
            await this.print();
            break;
          case 2:
            if (this.dateData.year < this.dateData.maxYear)
              this.dateData.year += 1;
            await this.print();
            break;
        }
      } else if (key.name === "down") {
        switch (this.editMode) {
          case 0:
            if (this.dateData.day > 1) this.dateData.day -= 1;
            await this.print();
            break;
          case 1:
            if (this.dateData.month > 0) {
              this.dateData.month -= 1;
              this.dateData.maxDay = new Date(
                this.dateData.year,
                this.dateData.month + 1,
                0
              ).getDate();
            }
            await this.print();
            break;
          case 2:
            if (this.dateData.year > 1) this.dateData.year -= 1;
            await this.print();
            break;
        }
      }
    }
  }

  private print() {
    this.date.setFullYear(this.dateData.year);
    this.date.setMonth(this.dateData.month);
    this.date.setDate(this.dateData.day);

    readline.cursorTo(process.stdout, 7);
    process.stdout.write(
      " " + this.formatDate(this.date, this.editMode) + "\u00a0".repeat(40)
    );
    readline.cursorTo(process.stdout, 7);
  }

  public formatDate(date: Date, editMode: number): string {
    return editMode == 3
      ? `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
      : `${editMode == 0 ? `${Colors.foreground.cyan}` : ``}${date.getDate()}${
          Colors.reset
        }.${editMode == 1 ? `${Colors.foreground.cyan}` : ``}${
          date.getMonth() + 1
        }${Colors.reset}.${
          editMode == 2 ? `${Colors.foreground.cyan}` : ``
        }${date.getFullYear()}${Colors.reset}`;
  }
}
