import { CustomEncoder } from './customEncoder';

describe('CustomEncoder', () => {
  let encoder: CustomEncoder;

  beforeAll(() => encoder = new CustomEncoder());

  it('should exists', () => expect(CustomEncoder).toBeDefined());
  it('should expose a encodeKey method that expects a string an return a string',
    () => expect(encoder.encodeKey('asdl+dasd')).toBe('asdl%2Bdasd'));
  it('should expose a encodeValue method that expects a string an return a string',
    () => expect(encoder.encodeValue('asdl+dasd')).toBe('asdl%2Bdasd'));
  it('should expose a decodeKey method that expects a string an return a string',
    () => expect(encoder.decodeKey('asdl%2Bdasd')).toBe('asdl+dasd'));
  it('should expose a decodeValue method that expects a string an return a string',
    () => expect(encoder.decodeValue('asdl%2Bdasd')).toBe('asdl+dasd'));
});
