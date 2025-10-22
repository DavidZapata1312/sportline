import { validators, validate } from '../src/utils/validation.js';

describe('validators', () => {
  test('required', () => {
    expect(validators.required('x')).toBe(true);
    expect(validators.required('')).toBe(false);
    expect(validators.required(null as any)).toBe(false);
  });

  test('email', () => {
    expect(validators.email('a@b.com')).toBe(true);
    expect(validators.email('bad')).toBe(false);
    expect(validators.email('')).toBe(true);
  });

  test('min/max length', () => {
    expect(validators.minLength(2)('ab')).toBe(true);
    expect(validators.minLength(3)('ab')).toBe(false);
    expect(validators.maxLength(3)('ab')).toBe(true);
    expect(validators.maxLength(1)('ab')).toBe(false);
  });

  test('positive/nonNegative', () => {
    expect(validators.positive(2)).toBe(true);
    expect(validators.positive(0)).toBe(false);
    expect(validators.nonNegative(0)).toBe(true);
    expect(validators.nonNegative(-1)).toBe(false);
  });

  test('alphanumeric', () => {
    expect(validators.alphanumeric('ABC-123')).toBe(true);
    expect(validators.alphanumeric('bad!')).toBe(false);
    expect(validators.alphanumeric('')).toBe(true);
  });

  test('phone', () => {
    expect(validators.phone('+1234567890')).toBe(true);
    expect(validators.phone('123 456 7890')).toBe(true);
    expect(validators.phone('bad')).toBe(false);
  });

  test('oneOf', () => {
    const isRole = validators.oneOf(['admin', 'staff']);
    expect(isRole('admin')).toBe(true);
    expect(isRole('user')).toBe(false);
  });
});

describe('validate()', () => {
  test('collects errors', () => {
    const rules = [
      { field: 'email', message: 'invalid', validator: validators.email },
      { field: 'name', message: 'required', validator: validators.required },
    ];
    const result = validate({ email: 'bad', name: '' }, rules);
    expect(result.isValid).toBe(false);
    expect(result.getErrors()).toHaveLength(2);
    expect(result.getFirstError()).toEqual({ field: 'email', message: 'invalid', value: 'bad' });
  });
});
