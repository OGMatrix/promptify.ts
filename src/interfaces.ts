import { Design } from "./enums";
import { Format, Prompt, Selection } from "./type";

export interface InputJsonOutput {
  answer: string;
  index?: number;
  choices?: number;
}

export interface InputPromptSettings {
  type: Prompt;
  q: string;
  required?: boolean;
  format?: Format;
  design?: InputPromptDesignSettings;
}

export interface InputPromptDesignSettings {
  header: Design;
  body: Design;
}

export interface InputSelectionSettings {
  type: Selection;
  choices: string[];
  q: string;
  format?: Format;
  design?: InputPromptDesignSettings;
}

export interface InputSelectionDesignSettings {
  header: Design;
  body: Design;
}