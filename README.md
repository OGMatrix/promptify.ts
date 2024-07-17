# ogmatrix-input

![version](https://img.shields.io/badge/version-0.0.1-blue)
![author](https://img.shields.io/badge/author-OGMatrix-green)

## Overview

**ogmatrix-input** is a modern, interactive command-line input utility for Node.js applications. It provides a rich and user-friendly experience for gathering various types of input, such as text, numbers, and selections, from the terminal. This library leverages the `readline` module to handle input efficiently and supports custom formatting and validation.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Prompt for Text Input](#prompt-for-text-input)
  - [Prompt for Number Input](#prompt-for-number-input)
  - [Prompt for Selection](#prompt-for-selection)
- [Methods](#methods)
  - [`prompt`](#prompt)
  - [`selection`](#selection)
- [Formatting](#formatting)
- [Examples](#examples)
- [License](#license)

## Installation

To install the Input Library, use npm:

```bash
npm install ogmatrix-input
```

## Usage

### Importing the Library

```javascript
import { Input } from 'ogmatrix-input';
```

### Prompt for Text Input

```javascript
const input = new Input();

(async () => {
  const response = await input.prompt('text', 'What is your name?', true);
  console.log(response);
})();
```

### Prompt for Number Input

```javascript
const input = new Input();

(async () => {
  const response = await input.prompt('number', 'Enter your age:', true);
  console.log(response);
})();
```

### Prompt for Selection

```javascript
const input = new Input();

(async () => {
  const choices = ['Option 1', 'Option 2', 'Option 3'];
  const response = await input.selection('single', choices, 'Choose an option:');
  console.log(response);
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

#### Returns

- `Promise<string | InputJsonOutput | null>` - The user's input in the specified format.

### `selection`

The `selection` method is used to gather a selection from a list of choices.

#### Parameters

- **type**: `"single"` - The type of selection (currently supports only "single").
- **choices**: `string[]` - The list of choices to present to the user.
- **q**: `string` - The question to display to the user.
- **format**: `"json" | "text"` - The format of the returned data (default: "json").

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
  "choices": ["Option 1", "Option 2", "Option 3"],
  "index": 1
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

```javascript
const input = new Input();

(async () => {
  const response = await input.prompt('text', 'Enter your favorite color:', true, 'text');
  console.log(`Your favorite color is ${response}`);
})();
```

### Selection Example

```javascript
const input = new Input();

(async () => {
  const choices = ['Red', 'Blue', 'Green'];
  const response = await input.selection('single', choices, 'Choose a color:', 'text');
  console.log(`You chose ${response}`);
})();
```

## License

This project is licensed under the MIT License.

---

By OGMatrix

---

Feel free to contribute, raise issues, or submit pull requests to improve this library. Happy coding!
