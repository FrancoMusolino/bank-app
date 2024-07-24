import { Identifier } from './Identifier';

describe('Identifier', () => {
  const first = new Identifier('abc');
  const second = new Identifier('abc');
  const third = new Identifier(123);
  const fourth = new Identifier('xyz');

  it('Should return the raw value', () => {
    expect(first.toValue()).toBe('abc');
    expect(third.toValue()).toBe(123);
  });

  it('Should return the stringify value', () => {
    expect(first.toString()).toBe('abc');
    expect(third.toString()).toBe('123');
  });

  it('Should be equals if Identifiers match', () => {
    expect(first.equals(second)).toBe(true);
  });

  it('Should not be equals if identifiers dont match', () => {
    expect(first.equals(fourth)).toBe(false);
  });

  it('Should not be equals if the identifier is null or undefined', () => {
    expect(first.equals(null)).toBe(false);
    expect(first.equals(undefined)).toBe(false);
  });

  it('Should not be equals if the identifier is a different object', () => {
    expect(first.equals({} as Identifier<string>)).toBe(false);
  });
});
