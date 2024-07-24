import { ValueObject } from './ValueObject';

const props = { color: 'red' };
const props2 = { color: 'blue' };

class Test extends ValueObject<typeof props> {
  constructor() {
    super(props);
  }
}

class Test2 extends ValueObject<typeof props> {
  constructor() {
    super(props);
  }
}

class Test3 extends ValueObject<typeof props> {
  constructor() {
    super(props2);
  }
}

class Test4 extends ValueObject<typeof props> {
  constructor() {
    super(undefined);
  }
}

describe('ValueObject', () => {
  const valueObject1 = new Test();
  const valueObject2 = new Test2();
  const valueObject3 = new Test3();
  const valueObject4 = new Test4();

  it('Should be equals if objects have the same shape and value', () => {
    expect(valueObject1.equals(valueObject2)).toBe(true);
  });

  it('Should not be equals if objects have different shapes or values', () => {
    expect(valueObject1.equals(valueObject3)).toBe(false);
  });

  it('Should not be equals if an object is null or undefined', () => {
    expect(valueObject1.equals(null)).toBe(false);
    expect(valueObject1.equals(undefined)).toBe(false);
  });

  it('Should not be equals if an object has empty props', () => {
    expect(valueObject1.equals(valueObject4)).toBe(false);
  });
});
