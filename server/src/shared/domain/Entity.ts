import { UniqueEntityID } from './UniqueEntityID';

export abstract class Entity<T> {
  protected readonly _id: UniqueEntityID;
  readonly props: T;

  constructor(props: T, id?: UniqueEntityID) {
    this._id = id ? id : new UniqueEntityID();
    this.props = props;
  }

  equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!this.isEntity(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }

  private isEntity(v: any): v is Entity<any> {
    return v instanceof Entity;
  }
}
