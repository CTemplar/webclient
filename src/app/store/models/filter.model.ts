export interface Filter {
  id?: number;
  name: string;
  parameter?: FilterParameter;
  condition?: FilterCondition;
  filter_text?: string;
  move_to?: boolean;
  folder?: string;
  mark_as_read?: boolean;
  mark_as_starred?: boolean;
}

export enum FilterParameter {
  SUBJECT = 'subject',
  SENDER = 'sender',
  Recipient = 'recipient'
}

export enum FilterCondition {
  CONTAINS = 'contains',
  STARTSWITH = 'startswith'
}
