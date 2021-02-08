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

function openEdge() {
  var openInEdge = document.querySelector('#openInEdge');
  openInEdge.href = 'microsoft-edge:https://ctemplar.com';
};

if (!checkSupportBrowser()) {
  document.body.style.backgroundColor = "#2a4c67";
  document.body.style.color = "white";
  document.body.style.textAlign = "center";
  document.body.style.fontFamily = '"Lato", Helvetica, Arial, sans-serif';
  document.body.innerHTML = ' \
    <div style="margin-top: 120px; font-size: 3.5rem; font-weight: 600;"> CTEMPLAR </div> \
    <div style="margin-top: 50px; font-size: 24px;"> We detected you are using Internet Explorer that we do not support,\
      <a target="_blank" rel="noopener noreferrer" onclick="openEdge();" id="openInEdge" href="#" style="color: white;">click here to open Edge</a>\
    </div> \
    <div style="margin-top: 15px; color: lightgray; font-size: 18px;"> Please visit CTemplar\'s  \
      <a target="_blank" rel="noopener noreferrer" href="microsoft-edge:https://ctemplar.com/help/answer/browser-support/" style="color: lightgray;">support browsers </a> \
     for more information. </div> \
  ';
}

if (!checkSupportCryptoBrowser()) {
  document.body.style.backgroundColor = "#2a4c67";
  document.body.style.color = "white";
  document.body.style.textAlign = "center";
  document.body.style.fontFamily = '"Lato", Helvetica, Arial, sans-serif';
  document.body.innerHTML = ' \
    <div style="margin-top: 120px; font-size: 3.5rem; font-weight: 600;"> CTEMPLAR </div> \
    <div style="margin-top: 50px; font-size: 24px;"> A browser that has crypto (A Pseudo Random Number Generator) is required to use CTemplar.</div> \
    <div style="margin-top: 15px; color: lightgray; font-size: 18px;"> Please visit CTemplar\'s  \
      <a target="_blank" rel="noopener noreferrer" href="microsoft-edge:https://ctemplar.com/help/answer/browser-support/" style="color: lightgray;">support browsers </a> \
     for more information. </div> \
  ';
}
