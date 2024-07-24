import { Password } from './Password';

describe('Password', () => {
  it('Should create a Password', () => {
    const passwordResult = Password.create({ value: '123' });
    expect(passwordResult.isSuccess).toBe(true);

    const password = passwordResult.getValue();
    expect(password).toBeInstanceOf(Password);
    expect(password.getValue()).toBe('123');
  });

  it('Should fail with an empty Password', () => {
    const passwordResult = Password.create({ value: '' });
    expect(passwordResult.isSuccess).toBe(false);
  });

  it('Should fail with an null Password', () => {
    const passwordResult = Password.create({ value: null });
    expect(passwordResult.isSuccess).toBe(false);
  });

  it('Should hash a plain text', () => {
    const password = '123';
    const hashedPassword = Password.hash(password);
    expect(hashedPassword).not.toBe(password);
  });

  it('Should match passwords', async () => {
    const hashedPassword = Password.hash('123');
    const password = Password.create({ value: hashedPassword }).getValue();
    expect(await password.compare('123')).toBe(true);
  });

  it('Should fail with different passwords', async () => {
    const hashedPassword = Password.hash('123');
    const password = Password.create({ value: hashedPassword }).getValue();
    expect(await password.compare('abc')).toBe(false);
  });
});
