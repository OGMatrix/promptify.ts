import { Design } from "./enums";
import { Format, Prompt, Selection } from "./type";
import { Colors } from './variables';

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
  colors: InputPromptDesignColorSettings
}

export interface InputPromptDesignColorSettings {
  box_color: string;
  shadow_color: string;
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