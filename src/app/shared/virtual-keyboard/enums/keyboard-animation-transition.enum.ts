// import { KeyboardAnimationState } from './keyboard-animation-state.enum';
//
// export enum KeyboardAnimationTransition {
//   Hide = `${KeyboardAnimationState.Visible} => ${KeyboardAnimationState.Hidden}`,
//   Show = `${KeyboardAnimationState.Void} => ${KeyboardAnimationState.Visible}`
// }

export enum KeyboardAnimationTransition {
  Hide = 'visible => hidden',
  Show = 'void => visible'
}
