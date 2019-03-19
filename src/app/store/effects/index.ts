import { ComposeMailEffects } from './compose-mail.effects';
import { RouterEffects } from './router.effect';
import { AuthEffects } from './auth.effects';
import { MailEffects } from './mail.effects';
import { SecureMessageEffects } from './secure-message.effects';
import { UsersEffects } from './users.effects';
import { TimezoneEffects } from './timezone.effects';
import { BitcoinEffects } from './bitcoin.effects';
import { MailboxEffects } from './mailbox.effects';
import { DonateEffects } from './donate.effects';

export const effects: any[] = [
  RouterEffects, AuthEffects,
  MailEffects, UsersEffects, TimezoneEffects, BitcoinEffects,
  MailboxEffects, ComposeMailEffects, SecureMessageEffects,
  DonateEffects
];

export * from './router.effect';
export * from './auth.effects';
export * from './mail.effects';
export * from './users.effects';
export * from './timezone.effects';
export * from './bitcoin.effects';
export * from './mailbox.effects';
export * from './compose-mail.effects';
export * from './secure-message.effects';
export * from './donate.effects';
