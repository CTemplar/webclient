import { RouterEffects } from './router.effect';
import { AuthEffects } from './auth.effects';
import { BlogEffects } from './blog.effects';

export const effects: any[] = [RouterEffects, AuthEffects, BlogEffects];

export * from './router.effect';
export * from './auth.effects';
export * from './blog.effects';
