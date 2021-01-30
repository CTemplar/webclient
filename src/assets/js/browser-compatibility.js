function checkSupportCryptoBrowser() {
  return (
    !(!window || undefined == typeof window || !window.crypto || !window.crypto.getRandomValues) ||
    (undefined != typeof window && 'object' == typeof window.msCrypto && 'function' == typeof window.msCrypto.getRandomValues)
  );
}

/**
 * detect IEEdge
 */
function checkSupportBrowser() {
  var ua = window.navigator.userAgent;
  // MicroSoft browser
  if (
      ua.indexOf('MSIE ') > 0 || 
      ua.indexOf('Trident/') > 0 || 
      ua.indexOf('Edge/') > 0
    )
  {
    return false;
  }
  // Other browser
  return true;
}

!1 === navigator.cookieEnabled && alert('Cookies are required to use CTemplar. Please enable cookies in your browser.'), 
checkSupportCryptoBrowser() || alert('A browser that has crypto (A Pseudo Random Number Generator) is required to use CTemplar. Please update your browser to latest version.');
checkSupportBrowser() || alert('We do not support Internet Explorer');
