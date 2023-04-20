type TCallBack<T> = (args: T) => void;

type TUnsubscribe = () => void;

type TSubscribers<T> = {
  [key in keyof T]: {
    [subscriberId: string]: TCallBack<T[key]>;
  };
};

class PubSub<TChanelPayload extends { [k: string]: unknown }> {
  private subscribers: TSubscribers<TChanelPayload> = {} as TSubscribers<TChanelPayload>;

  constructor() {}

  public subscribe<TChanel extends keyof TChanelPayload>(
    chanel: TChanel,
    cb: (data: TCallBack<TChanelPayload[TChanel]>) => void
  ): TUnsubscribe {
    const subscriberId = String(Math.random()).slice(2);

    const chanelName = String(chanel) as keyof TChanelPayload;

    this.subscribers[chanelName] = this.subscribers[chanelName] || {};

    //@ts-ignore
    this.subscribers[chanelName as TChanel][subscriberId] = cb;

    return () => {
      if (this.subscribers[chanel]) {
        const { [subscriberId]: removed, ...rest } = this.subscribers[chanel];

        this.subscribers[chanel] = rest;
      }

      if (Object.keys(this.subscribers[chanel]).length === 0) {
        delete this.subscribers[chanel];
      }
    };
  }

  public publish<TChanel extends keyof TChanelPayload>(
    chanelName: TChanel,
    data: TChanelPayload[TChanel]
  ) {
    const channel = String(chanelName);

    if (!this.subscribers[channel]) {
      return;
    }

    Object.values(this.subscribers[channel]).forEach((subscriber) => {
      subscriber(data as any);
    });
  }

  public getSubscriberCounts(chanelName: string) {
    const channel = String(chanelName);

    return Object.keys(this.subscribers[channel] || {}).length;
  }
}

class DataStore<T extends { [k: string]: unknown }> extends PubSub<T> {
  constructor() {
    super();
  }
}

type data1 = {
  on: true;
  off: false;
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
