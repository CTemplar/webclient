export function getScrollParent(node: any): any {
  const isElement = node instanceof HTMLElement;
  const overflowY = isElement && window.getComputedStyle(node).overflowY;
  const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

  if (!node) {
    return null;
  }
  if (isScrollable && node.scrollHeight >= node.clientHeight) {
    return node;
  }

  return getScrollParent(node.parentNode) || document.body;
}

export function scrollIntoView(id: any, isFirefox = false, offset = 0): any {
  // Firefox cuts off top of the body when using scrollIntoView
  // Ctemplar display problem #437
  if (isFirefox) {
    const fragmentDOM: HTMLElement = document.querySelector(`#${id}`);
    const parent: HTMLElement = getScrollParent(fragmentDOM);
    if (parent) {
      parent.scrollTop = fragmentDOM?.offsetTop + offset;
    }
  } else {
    document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' });
  }
}
