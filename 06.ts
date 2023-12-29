type FilterChildrenBy<Union, Condition> = Union extends Condition
  ? never
  : Union;
