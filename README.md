# ogmatrix-input

![version](https://img.shields.io/badge/version-0.2.1-blue)
![author](https://img.shields.io/badge/author-OGMatrix-green)

## Overview

**ogmatrix-input** is a modern, interactive command-line input utility for Node.js applications. It provides a rich and user-friendly experience for gathering various types of input, such as text, numbers, and selections, from the terminal. This library leverages the `readline` module to handle input efficiently and supports custom formatting and validation.

## Table of Contents

- [ogmatrix-input](#ogmatrix-input)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Importing the Library](#importing-the-library)
    - [Prompt for Text Input](#prompt-for-text-input)
    - [Prompt for Number Input](#prompt-for-number-input)
    - [Prompt for Selection](#prompt-for-selection)
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
  - [Formatting](#formatting)
    - [JSON Format](#json-format)
    - [Text Format](#text-format)
  - [Examples](#examples)
    - [Text Input Example](#text-input-example)
    - [Selection Example](#selection-example)
  - [License](#license)

## Installation

To install `ogmatrix-input`, use npm:

```bash
npm install ogmatrix-input
```

## Usage

### Importing the Library

```typescript
import { Input } from 'ogmatrix-input';
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
- **design**: `InputPromptDesignSettings` - Custom design settings for the prompt.

#### Returns

- `Promise<string | InputJsonOutput | null>` - The selected choice in the specified format.

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

## License

This project is licensed under the MIT License.

---

By OGMatrix

---

Feel free to contribute, raise issues, or submit pull requests to improve this library. Happy coding!

---
