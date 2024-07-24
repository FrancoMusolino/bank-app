import { Identifier } from './Identifier';
import { UniqueEntityID } from './UniqueEntityID';

describe('UniqueEntityID', () => {
  const id = new UniqueEntityID('abc');

  it('UniqueEntityID should extends from Identifier', () => {
    expect(id).toBeInstanceOf(Identifier);
  });

  it('Should use the given value', () => {
    expect(id.toValue()).toBe('abc');
  });

  it('Should assign a cuid id if not value is provided', () => {
    expect(new UniqueEntityID().toValue()).toBeDefined();
  });
});
