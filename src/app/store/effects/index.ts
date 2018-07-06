import { RouterEffects } from './router.effect';
import { AuthEffects } from './auth.effects';
import { BlogEffects } from './blog.effects';
import { MailEffects } from './mail.effects';
import { UsersEffects } from './users.effects';
import { TimezoneEffects } from './timezone.effects';

export const effects: any[] = [RouterEffects, AuthEffects, BlogEffects, MailEffects, UsersEffects, TimezoneEffects];

export * from './router.effect';
export * from './auth.effects';
export * from './blog.effects';
export * from './mail.effects';
export * from './users.effects';
export * from './timezone.effects';
