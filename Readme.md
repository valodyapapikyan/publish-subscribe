# Publisher/Subscriber

 Simple Publisher/Subscriber Mechanism.

# Usage

```
import{ PubSub } from './PublisherSubscriber';


class DataStore<T extends { [k: string]: unknown }> extends PubSub<T> {
  constructor() {
    super();
  }

  //your code
}

type data1 = {
  on: boolean;
  off: boolean;
};

type data2 = {
  on: false;
  off: true;
};
type MyEvent = {
  onStart: data1;
  onFinish: data2;
};

const ds = new DataStore<MyEvent>();

const getDebounced = function (cb: (args: any) => any) {
  let timeout: ReturnType<typeof setTimeout>;

  return function (args: any) {
    clearTimeout(timeout);

    timeout = setTimeout(() => cb(args), 3000);
  };
};

const getDebounce = getDebounced((data) => {
  console.log(data);
});

// delayed
const unsubscribe1 = ds.subscribe('onStart', (data) => getDebounce(data));


const unsubscribe = ds.subscribe('onFinish', (data) => {
  console.log('data - 2', data);
});

ds.publish('onStart', { on: true, off: false });
ds.publish('onFinish', { off: true, on: false });
```