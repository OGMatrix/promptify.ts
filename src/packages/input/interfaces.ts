import { Design } from "./enums";
import { FileType, Format, Prompt, Selection, UrlProtocol } from "./type";
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
  design?: InputSelectionDesignSettings;
}

export interface InputSelectionDesignSettings {
  header: Design;
  body: Design;
  colors: InputSelectionDesignColorSettings
}

export interface InputSelectionDesignColorSettings {
  box_color: string;
  shadow_color: string;
}

// Filedialog
export interface InputFiledialogSettings {
  type: FileType;
  q: string;
  startPath?: string;
  extensions?: string;
  showHiddenFolders?: boolean;
  format?: Format;
  design?: InputFiledialogDesignSettings;
}

export interface InputFiledialogDesignSettings {
  header: Design;
  body: Design;
  colors: InputFiledialogDesignColorSettings
}

export interface InputFiledialogDesignColorSettings {
  box_color: string;
  shadow_color: string;
}

// Date
export interface InputDateSettings {
  q: string;
  startDate?: Date;
  format?: Format;
  design?: InputDateDesignSettings;
}

export interface InputDateDesignSettings {
  header: Design;
  body: Design;
  colors: InputDateDesignColorSettings
}

export interface InputDateDesignColorSettings {
  box_color: string;
  shadow_color: string;
}

// Url
export interface InputUrlSettings {
  q: string;
  protocol?: UrlProtocol;
  required?: boolean;
  format?: Format;
  design?: InputUrlDesignSettings;
}

export interface InputUrlDesignSettings {
  header: Design;
  body: Design;
  colors: InputUrlDesignColorSettings
}

export interface InputUrlDesignColorSettings {
  box_color: string;
  shadow_color: string;
}
