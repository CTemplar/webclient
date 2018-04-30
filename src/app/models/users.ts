export class Membership {
  id: number;
  name: string;
  price: number;
  users: number;
  storage: number;
  aliases: number;
  sending_limit: number;
  filters: boolean;
  autoresponders: boolean;
  catch_all: boolean;
}

export class User {
  id?: number;
  username?: string;
  password?: string;
  is_active?: boolean;
  newsletter?: boolean;
  membership?: Membership;
  token?: string;
  pubkey?: string;
  privkey?: string;
}

export interface Storage {
  type: string;
  money: number;
}
