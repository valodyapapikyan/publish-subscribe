# Publisher/Subscriber

 Simple Publisher/Subscriber Mechanism.

# Usage

```
import{ PubSub } from './PublisherSubscriber';


class DataStore<T extends { [K: string]: any }> extends PubSub<T> {
  constructor() {
    super();
  }
}

const getDebounced = function (cb: (args: any) => any) {
  let timeout: ReturnType<typeof setTimeout>;

  return function (args: any) {
    clearTimeout(timeout);

    timeout = setTimeout(() => cb(args), 2000);
  };
};

type a = {
  value: number;
};

type b = {
  value: number;
};

type TEvent = {
  start: a;
  stop: b;
};

const dataStore = new DataStore<TEvent>();

const delayed = getDebounced((data)=> console.log(data));


const unsubscribeStart = dataStore.subscribe('start', (data) => delayed(data));

const unsubscribeStop =  dataStore.subscribe('stop', (data) => {
  console.log(data);
});

unsubscribeStop();


dataStore.publish("start", {value: 1});
dataStore.publish("stop", {value: 0})

```