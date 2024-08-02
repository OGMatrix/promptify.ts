![image](https://github.com/OGMatrix/promptify.ts/blob/main/assets/header.png?raw=true)
# promptify.ts

![version](https://img.shields.io/badge/version-0.5.1-blue)
![author](https://img.shields.io/badge/author-OGMatrix-green)

## Overview

**promptify.ts** is a modern, interactive command-line input utility for Node.js applications. It provides a rich and user-friendly experience for gathering various types of input, such as text, numbers, and selections, from the terminal. This library leverages the `readline` module to handle input efficiently and supports custom formatting and validation.

## Table of Contents

- [promptify.ts](#promptifyts)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Importing the Library](#importing-the-library)
    - [Prompt for Text Input](#prompt-for-text-input)
    - [Prompt for Number Input](#prompt-for-number-input)
    - [Prompt for Selection](#prompt-for-selection)
    - [Prompt for Password](#prompt-for-password)
    - [Prompt for Boolean](#prompt-for-boolean)
    - [Prompt for a File](#prompt-for-a-file)
    - [Prompt for a Date](#prompt-for-a-date)
    - [Prompt for a Url](#prompt-for-a-url)
  - [Settings](#settings)
    - [Design](#design)
    - [Color Settings](#color-settings)
  - [Methods](#methods)
    - [`prompt`](#prompt)
      - [Parameters](#parameters)
      - [Returns](#returns)
    - [`selection`](#selection)
      - [Parameters](#parameters-1)
      - [Returns](#returns-1)
    - [`pwd`](#pwd)
      - [Parameters](#parameters-2)
      - [Returns](#returns-2)
    - [`bool`](#bool)
      - [Parameters](#parameters-3)
      - [Returns](#returns-3)
    - [`filedialog`](#filedialog)
      - [Parameters](#parameters-4)
      - [Returns](#returns-4)
    - [`date`](#date)
      - [Parameters](#parameters-5)
      - [Returns](#returns-5)
    - [`url`](#url)
      - [Parameters](#parameters-6)
      - [Returns](#returns-6)
  - [Formatting](#formatting)
    - [JSON Format](#json-format)
    - [Text Format](#text-format)
  - [Examples](#examples)
    - [Text Input Example](#text-input-example)
    - [Selection Example](#selection-example)
    - [Password Example](#password-example)
    - [Boolean Example](#boolean-example)
    - [Filedialog Example](#filedialog-example)
  - [License](#license)

## Installation

To install `promptify.ts`, use npm:

```bash
npm install promptify.ts
```

## Usage

### Importing the Library

```typescript
import { Input } from 'promptify.ts';
```

### Prompt for Text Input

```typescript
const input = new Input();

(async () => {
  const response = await input.prompt({
    type: "text",
    q: "What is your name?",
    required: true
  });
  console.log(response);
})();
```

### Prompt for Number Input

```typescript
const input = new Input();

(async () => {
  const response = await input.prompt({
    type: "number",
    q: "Enter your age:",
    required: true
  });
  console.log(response);
})();
```

### Prompt for Selection

```typescript
const input = new Input();

(async () => {
  const choices = ['Option 1', 'Option 2', 'Option 3'];
  const response = await input.selection({
    type: "single",
    choices,
    q: "Choose an option:"
  });
  console.log(response);
})();
```

### Prompt for Password

```typescript
const input = new Input();

(async () => {
  const response = await input.pwd({
    q: "Enter your password",
  });
  console.log(response);
})();
```

### Prompt for Boolean

```typescript
const input = new Input();

(async () => {
  const response = await input.bool({
    q: "Do you want to continue?",
    default_bool: true
  });
  console.log(response);
})();
```

### Prompt for a File

```typescript
const input = new Input();

(async () => {
  const response = await input.filedialog({
    type: "file",
    q: "Select your config file"
  });
  console.log(response);
})();
```

### Prompt for a Date

```typescript
const input = new Input();

(async () => {
  const response = await input.date({
    q: "Select your favourite date"
  });
  console.log(response);
})();
```

### Prompt for a Url

```typescript
const input = new Input();

(async () => {
  const response = await input.url({
    q: "Input your favourite youtube video",
    protocol: "https"
  });
  console.log(response);
})();
```

## Settings

### Design

The `design` setting allows you to customize the appearance of the prompt. The available design options are:

- `Design.Simple`: A basic design with minimal styling.
- `Design.Modern`: A stylish design with shadows and colors.
- `Design.Colorful`: A vibrant design with multiple colors.

### Color Settings

You can customize the colors used in the prompt box and its shadow:

- `box_color`: The color of the prompt box.
- `shadow_color`: The color of the shadow effect.

Example configuration for design parameter:

```typescript
{
  header: Design.Modern,
  body: Design.Modern,
  colors: {
    box_color: Colors.foreground.white,
    shadow_color: Colors.foreground.gray
  }
}
```

```typescript
const input = new Input();

(async () => {
  const response = await input.prompt({
    type: "text",
    q: "Enter your favorite color:",
    format: "text",
    design: {
      header: Design.Modern,
      body: Design.Modern,
      colors: {
        box_color: Colors.foreground.white,
        shadow_color: Colors.foreground.gray
      }
    }
  });
  console.log(`Your favorite color is ${response}`);
})();
```

## Methods

### `prompt`

The `prompt` method is used to gather text or number input from the user.

#### Parameters

- **type**: `"text" | "number"` - The type of input to prompt for.
- **q**: `string` - The question to display to the user.
- **required**: `boolean` - Whether the input is required.
- **format**: `"json" | "text"` - The format of the returned data (default: "json").
- **design**: `InputPromptDesignSettings` - Custom design settings for the prompt.

#### Returns

- `Promise<string | InputJsonOutput | null>` - The user's input in the specified format.

### `selection`

The `selection` method is used to gather a selection from a list of choices.

#### Parameters

- **type**: `"single"` - The type of selection (currently supports only "single").
- **choices**: `string[]` - The list of choices to present to the user.
- **q**: `string` - The question to display to the user.
- **format**: `"json" | "text"` - The format of the returned data (default: "json").
- **design**: `InputSelectionDesignSettings` - Custom design settings for the prompt.

#### Returns

- `Promise<string | InputJsonOutput | null>` - The selected choice in the specified format.

### `pwd`

The `pwd` method is used to gather a password.

#### Parameters

- **q**: `string` - The question to display to the user.
- **required**: `boolean` - Whether the input is required.
- **format**: `"json" | "text"` - The format of the returned data (default: "json").
- **design**: `InputPwdDesignSettings` - Custom design settings for the prompt.

#### Returns

- `Promise<string | InputJsonOutput | null>` - The password in the specified format.

### `bool`

The `bool` method is used to gather a boolean.

#### Parameters

- **q**: `string` - The question to display to the user.
- **required**: `boolean` - Whether the input is required.
- **default_bool**: `boolean` - What the default boolean should be.
- **format**: `"json" | "text"` - The format of the returned data (default: "json").
- **design**: `InputBoolDesignSettings` - Custom design settings for the prompt.

#### Returns

- `Promise<string | InputJsonOutput | null>` - The boolean in the specified format.

### `filedialog`

The `filedialog` method is used to gather a file path.

#### Parameters

- **type**: `string` - The type you want to gather ("file" or "folder")
- **q**: `string` - The question or prompt to display to the user.
- **startPath**: `string` - Where the dialog will start at (default: "__dirname" (current file path) ).
- **extensions**: `string` - What extensions you want to filter. (default: "*", example: ".jpg,.png,.jpeg")
- **showHiddenFolders**: `boolean` - Whether to show hidden folders (start with ".") (default: false).
- **format**: `"json" | "text"` - The format of the returned data (default: "json").
- **design**: `InputFiledialogDesignSettings` - Custom design settings for the prompt.

#### Returns

- `Promise<string | InputJsonOutput | null>` - The file path in the specified format.

### `date`

The `date` method is used to gather a date.

#### Parameters

- **q**: `string` - The question or prompt to display to the user.
- **startDate**: `string` - Which date that should be selected by default (default: new Date())
- **format**: `"json" | "text"` - The format of the returned data (default: "json").
- **design**: `InputDateDesignSettings` - Custom design settings for the prompt.

#### Returns

- `Promise<string | InputJsonOutput | null>` - The date in the specified format.

### `url`

The `date` method is used to gather a url.

#### Parameters

- **q**: `string` - The question or prompt to display to the user.
- **protocol**: `UrlProtocol` - What protocol should be accepted (default: https(s) )
- **format**: `"json" | "text"` - The format of the returned data (default: "json").
- **design**: `InputUrlDesignSettings` - Custom design settings for the prompt.

#### Returns

- `Promise<string | InputJsonOutput | null>` - The url in the specified format.

## Formatting

The library supports formatting the output as either JSON or plain text. By default, the output is formatted as JSON, but this can be changed by setting the `format` parameter in the methods.

### JSON Format

The JSON format provides structured output with additional metadata.

Example:
```json
{
  "answer": "your_input_here",
  "index": 1,
  "choices": ["Option 1", "Option 2", "Option 3"]
}
```

Example for boolean:
```json
{
  "answer": "true",
  "bool": true
}
```

### Text Format

The text format returns the raw input as a string.

Example:
```
your_input_here
```

## Examples

### Text Input Example

```typescript
const input = new Input();

(async () => {
  const response = await input.prompt({
    type: "text",
    q: "Enter your favorite color:",
    format: "text"
  });
  console.log(`Your favorite color is ${response}`);
})();
```

### Selection Example

```typescript
const input = new Input();

(async () => {
  const choices = ['Red', 'Blue', 'Green'];
  const response = await input.selection({
    type: "single",
    choices,
    q: "Choose a color:",
    format: "text"
  });
  console.log(`You chose ${response}`);
})();
```

### Password Example

```typescript
const input = new Input();

(async () => {
  const response = await input.pwd({
    q: "Enter your password",
    format: "text"
  });
  console.log(`Your password is ${response}`);
})();
```

### Boolean Example

```typescript
const input = new Input();

(async () => {
  const response = await input.bool({
    q: "Do you want to continue?",
    default_bool: true,
    format: "text"
  });
  console.log(`Your boolean is ${response}`);
})();
```

### Filedialog Example

```typescript
const input = new Input();

(async () => {
  const response = await input.filedialog({
    type: "file",
    q: "Choose your favourite image",
    startPath: "E:/users/YOUR_USER/pictures",
    showHiddenFolders: true,
    extensions: ".png,.jpg,.jpeg,.avif",
    format: "text"
  });
  console.log(`You chose ${response}`);
})();
```

## License

This project is licensed under the MIT License.

---

By OGMatrix

---

Feel free to contribute, raise issues, or submit pull requests to improve this library. Happy coding!

---
