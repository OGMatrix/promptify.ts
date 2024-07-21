// __tests__/Input.test.ts
import { Input } from '../src/index';
import { Design, Colors } from '../src/index';

describe('Input Class', () => {
  let input: Input;

  beforeEach(() => {
    input = new Input();
  });

  test('should return correct JSON output for bool input', async () => {
    jest.spyOn(process.stdin, 'on').mockImplementation((event: any, callback: any): any => {
      if (event === 'keypress') {
        callback(null, { name: 'return' });
      }
    });

    const settings = {
      q: 'Is this a test?',
      required: true,
      default_bool: true,
      format: 'json' as const,
      design: {
        header: Design.Modern,
        body: Design.Modern,
        colors: {
          box_color: Colors.foreground.white,
          shadow_color: Colors.foreground.gray,
        },
      },
    };

    const result = await input.bool(settings);
    expect(result).toEqual({ answer: 'true', bool: true });
  });

  test('should return correct JSON output for password input', async () => {
    jest.spyOn(process.stdin, 'on').mockImplementation((event: any, callback: any): any => {
      if (event === 'keypress') {
        callback(null, { name: 'return' });
      }
    });

    const settings = {
      q: 'Enter your password:',
      required: false,
      format: 'json' as const,
      design: {
        header: Design.Modern,
        body: Design.Modern,
        colors: {
          box_color: Colors.foreground.white,
          shadow_color: Colors.foreground.gray,
        },
      },
    };

    const result = await input.pwd(settings);
    expect(result).toEqual({ answer: '' });
  });

  test('should return correct JSON output for text prompt', async () => {
    jest.spyOn(process.stdin, 'on').mockImplementation((event: any, callback: any): any => {
      if (event === 'keypress') {
        callback(null, { name: 'return' });
      }
    });

    const settings = {
      type: 'text' as const,
      q: 'Enter some text:',
      required: false,
      format: 'json' as const,
      design: {
        header: Design.Modern,
        body: Design.Modern,
        colors: {
          box_color: Colors.foreground.white,
          shadow_color: Colors.foreground.gray,
        },
      },
    };

    const result = await input.prompt(settings);
    expect(result).toEqual({ answer: '' });
  });
});
