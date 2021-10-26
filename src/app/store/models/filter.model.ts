export interface Filter {
  id?: number;
  conditions?: FilterConditionObject[];
  folder?: string;
  mark_as_read?: boolean;
  mark_as_starred?: boolean;
  move_to?: boolean;
  name: string;
  priority_order?: number;
  delete_msg?: boolean;
}

export interface FilterConditionObject {
  id?: number;
  parameter?: FilterParameter;
  condition?: FilterCondition;
  condition_text?: string;
  filter_text?: string;
}

export enum FilterParameter {
  SUBJECT = 'subject',
  SENDER = 'sender',
  RECIPIENT = 'recipient',
  HEADER = 'header',
}

export enum FilterCondition {
  CONTAINS = 'contains',
  DOES_NOT_CONTAIN = 'not_contains',
  STARTSWITH = 'startswith',
  DOES_NOT_STARTSWITH = 'not_startswith',
  ENDSWITH = 'endswith',
  DOES_NOT_ENDSWITH = 'not_endswith',
  EXACTLY = 'exactly',
  DOES_NOT_EXACTLY = 'not_exactly',
  MATCH = 'pattern',
  DOES_NOT_MATCH = 'not_pattern',
}

export const FilterConditionChoices = {
  contains: 'Contains',
  not_contains: 'Does Not Contain',
  startswith: 'Startswith',
  not_startswith: 'Does Not Startswith',
  endswith: 'Endswith',
  not_endswith: 'Does Not Endswith',
  exactly: 'Exactly',
  not_exactly: 'Does Not Exactly Match',
  pattern: 'Match',
  not_pattern: 'Does Not Match',
};
