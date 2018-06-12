export function loadScript(src) {
  let node = document.createElement("script");
  node.src = src;
  node.async = true;
  node.defer = true;
  document.getElementsByTagName("head")[0].appendChild(node);
}
