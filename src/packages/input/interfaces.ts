import { Design } from "./enums";
import { Format, Prompt, Selection } from "./type";
import { Colors } from './variables';

export interface InputJsonOutput {
  answer: string;
  index?: number;
  choices?: number;
}

// Bool

export interface InputBoolSettings {
  q: string;
  required?: boolean;
  default_bool?: boolean;
  format?: Format;
  design?: InputBoolDesignSettings;
}

export interface InputBoolDesignSettings {
  header: Design;
  body: Design;
  colors: InputBoolDesignColorSettings
}

export interface InputBoolDesignColorSettings {
  box_color: string;
  shadow_color: string;
}

// PWD

export interface InputPwdSettings {
  q: string;
  required?: boolean;
  format?: Format;
  design?: InputPwdDesignSettings;
}

export interface InputPwdDesignSettings {
  header: Design;
  body: Design;
  colors: InputPwdDesignColorSettings
}

export interface InputPwdDesignColorSettings {
  box_color: string;
  shadow_color: string;
}

// PROMPT

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

// SELECTION

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