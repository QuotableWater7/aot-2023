type Address = { address: string; city: string };
type PresentDeliveryList<A> = {
  [K in keyof A]: Address;
};
