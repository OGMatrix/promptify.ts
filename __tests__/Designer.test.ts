// __tests__/Designer.test.ts
import { Designer } from '../src/packages/input/src/designer';
import { Logger } from '../src/index';
import { Design, Colors } from '../src/index';

describe('Designer Class', () => {
  let designer: Designer;
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
    designer = new Designer({
      header: Design.Modern,
      body: Design.Modern,
      colors: {
        box_color: Colors.foreground.white,
        shadow_color: Colors.foreground.gray,
      },
    }, logger, '0.2.3', 'Is this a test?');
  });

  test('should log header correctly for Modern design', () => {
    const logSpy = jest.spyOn(logger, 'print').mockImplementation(() => {});

    designer.log_header();

    expect(logSpy).toHaveBeenCalledTimes(11);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Is this a test?'));
  });

  test('should get current cursor position', async () => {
    jest.spyOn(process.stdin, 'once').mockImplementation((event: any, callback: any): any => {
      if (event === 'readable') {
        callback();
      }
    });

    jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    jest.spyOn(process.stdin, 'read').mockImplementation(() => '\u001b[9;1R');

    const position = await designer.get_current_position();
    expect(position).toEqual({ y: '9', x: '1' });
  });
});
