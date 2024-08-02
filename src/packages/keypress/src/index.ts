import { Colors, Format, InputJsonOutput } from "../../input";

function format(
  text: string,
  toFormat: Format,
  data: any = {}
): InputJsonOutput | string {
  if (toFormat === "json") {
    if (data) data.answer = text;
    return data;
  } else if (toFormat === "text") {
    return text;
  }

  return "";
}

function isLetter(text: string): boolean {
  return /^[a-zA-Z]$/.test(text);
}

function isNumber(text: string): boolean {
  return /^[0-9]$/.test(text);
}

function isSymbol(text: string): boolean {
  return /^[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]$/.test(text);
}

export { format, isLetter, isNumber, isSymbol };
