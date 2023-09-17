import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";


@Injectable()
export class ObserverArrayService<T> {
  private items: T[] = [];

  constructor(private readonly eventEmitter: EventEmitter2) { }

  addItem(item: T) {
    this.items.push(item);
    this.eventEmitter.emit('itemAdded', item);
  }
  filter(cb: (value: T) => boolean) {
    this.items = this.items.filter(cb)
  }
  setItem(index: number, item: T) {
    this.items[index] = item
    this.eventEmitter.emit('itemSet', item);
  }

  getItems() {
    return this.items;
  }
}