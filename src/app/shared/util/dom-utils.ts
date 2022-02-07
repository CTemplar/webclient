// Firefox cuts off top of the body when using scrollIntoView
// Ctemplar display problem #437 fix by scroll the top of the page again
export function scrollIntoView(element: HTMLElement): void {
  setTimeout(() => element?.scrollIntoView({ behavior: 'smooth' }));
  setTimeout(() => document.querySelector('app-mail')?.scrollIntoView(), 500);
}
