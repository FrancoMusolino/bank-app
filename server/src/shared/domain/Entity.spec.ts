import { Entity } from './Entity';
import { UniqueEntityID } from './UniqueEntityID';

class Test extends Entity<null> {
  constructor() {
    super(null, new UniqueEntityID('abc'));
  }
}

class Test2 extends Entity<null> {
  constructor() {
    super(null, new UniqueEntityID('abc'));
  }
}

class Test3 extends Entity<null> {
  constructor() {
    super(null, new UniqueEntityID('xyz'));
  }
}

class Test4 extends Entity<null> {
  constructor() {
    super(null);
  }
}

describe('Entity', () => {
  const entity1 = new Test();
  const entity2 = new Test2();
  const entity3 = new Test3();
  const entity4 = new Test4();

  it('Should be equals if instances have same ID', () => {
    expect(entity1.equals(entity2)).toBe(true);
  });

  it('Should not be equals if instances have different ID', () => {
    expect(entity1.equals(entity3)).toBe(false);
  });

  it('Should return true if the same object is passed', () => {
    expect(entity1.equals(entity1)).toBe(true);
  });

  it('Should return false if an instance is null or undefined', () => {
    expect(entity1.equals(null)).toBe(false);
    expect(entity1.equals(undefined)).toBe(false);
  });

  it('Should return false if the object is not an Entity', () => {
    expect(entity1.equals({} as Entity<null>)).toBe(false);
  });

  it('Should assign a default ID if not value is provided', () => {
    expect(entity4).toBeDefined();
  });
});
