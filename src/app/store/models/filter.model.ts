export interface Filter {
  id?: number;
  condition?: FilterCondition;
  filter_text?: string;
  folder?: string;
  mark_as_read?: boolean;
  mark_as_starred?: boolean;
  move_to?: boolean;
  name: string;
  parameter?: FilterParameter;
}

export enum FilterParameter {
  RECIPIENT = 'recipient',
  SENDER = 'sender',
  SUBJECT = 'subject'
}

export enum FilterCondition {
  CONTAINS = 'contains',
  STARTSWITH = 'startswith'
}
