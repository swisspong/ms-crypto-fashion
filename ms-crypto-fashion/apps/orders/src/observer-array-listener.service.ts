import { Injectable } from "@nestjs/common";
import { ObserverArrayService } from "./observer-array.service";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class ObserverArrayListenerService<T> {
  constructor(private readonly eventEmitter: EventEmitter2) { }

  async waitForItemAdded(): Promise<T> {
    return new Promise((resolve) => {
      this.eventEmitter.on('itemAdded', (item:T) => {
        resolve(item);
      });
    });
  }
  async waitForItemSet(callback: (item: T) => boolean): Promise<T> {
    return new Promise((resolve) => {
      const handler = (item: T) => {
        if (callback(item)) {
          resolve(item);
          this.eventEmitter.removeListener('itemSet', handler)
        }
      }
      this.eventEmitter.on('itemSet', handler);
    });
  }
}