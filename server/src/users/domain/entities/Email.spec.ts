import { Email } from './Email';

describe('Email', () => {
  it('Should create an Email', () => {
    const emailResult = Email.create({ value: 'test@gmail.com' });
    expect(emailResult.isSuccess).toBe(true);

    const email = emailResult.getValue();
    expect(email).toBeInstanceOf(Email);
    expect(email.getValue()).toBe('test@gmail.com');
  });

  it('Should fail with an invalid Email', () => {
    const emailResult = Email.create({ value: 'asd' });
    expect(emailResult.isSuccess).toBe(false);
    expect(emailResult.getErrorValue()).toBe('El email es inválido');
  });

  it('Should fail with an null Email', () => {
    const emailResult = Email.create({ value: null });
    expect(emailResult.isSuccess).toBe(false);
  });
});
