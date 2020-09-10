function checkBrowserCompatibilty() {
  return (
    !(!window || 'undefined' == typeof window || !window.crypto || !window.crypto.getRandomValues) ||
    ('undefined' != typeof window &&
      'object' == typeof window.msCrypto &&
      'function' == typeof window.msCrypto.getRandomValues)
  );
}
!1 === navigator.cookieEnabled && alert('Cookies are required to use CTemplar. Please enable cookies in your browser.'),
  checkBrowserCompatibilty() ||
    alert(
      'A browser that has crypto (A Pseudo Random Number Generator) is required to use CTemplar. Please update your browser to latest version.',
    );
