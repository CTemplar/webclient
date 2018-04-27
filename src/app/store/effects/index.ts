import { RouterEffects } from './router.effect';
import { AuthEffects } from './auth.effects';
import { BlogEffects } from './blog.effects';
import { MailEffects } from './mail.effects';

export const effects: any[] = [RouterEffects, AuthEffects, BlogEffects, MailEffects];

export * from './router.effect';
export * from './auth.effects';
export * from './blog.effects';
export * from './mail.effects';
