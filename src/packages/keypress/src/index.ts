import { Format, InputJsonOutput, UrlProtocol } from "../../input";
import { REGEX } from "../../regex";

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
  return REGEX.letter.test(text);
}

function isNumber(text: string): boolean {
  return REGEX.number.test(text);
}

function isSymbol(text: string): boolean {
  return REGEX.symbol.test(text);
}

function isUrl(text: string, protocol: UrlProtocol): boolean {
  let val = false;
  switch (protocol) {
    case "http":
      val = REGEX.url.http.test(text);
      break;
    case "https":
      val = REGEX.url.https.test(text);
      break;
    case "http(s)":
      val = REGEX.url.any.test(text);
      break;
  }
  return val;
}

export { format, isLetter, isNumber, isSymbol, isUrl };
