type TCallBack<T> = (args: T) => void;

type TUnsubscribe = () => void;

type TSubscribers<T> = {
  [key in keyof T]: {
    [subscriberId: string]: TCallBack<T[key]>;
  };
};

export class PubSub<TChanelPayload extends { [k: string]: unknown }> {
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

