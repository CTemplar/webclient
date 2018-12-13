# CTemplar Build

Official Angular cross-platform client for the CTemplar secure email service available at [https://ctemplar.com](https://ctemplar.com).

RELEASE VERSION : **${version}**    

SHA-256 checksum of `index.html` : **${hash}**  

Find full release code and distribution at : [https://github.com/CTemplar/webclient/releases/latest](https://github.com/CTemplar/webclient/releases/latest)


## Transparent build code

We host our code publicly on Github. Every change there is tracked.
When we release a new version there are a few ways we guarantee there isn’t any change into the code.

* JavaScript files are using SRI, so they cannot be manipulated as the web browser will stop the execution and alert the user. We host them, but they are protected even from us, see next step.

* The `index.html` file is the main loaded file, the one decides which JS files and other things the site will load from the beginning, and `SRI` ensures they are those recognized. Every release we generate a SHA‌-256 checksum of it and we publish it here publicly (like traditional software does), any history change/manipulation will be tracked by Github.

* If users don’t trust this at all and they want to proof the checksum by hand is very easy too and we encourage doing it.
  They can open the source code from their browser (right click, view source code) copy the whole and generate the SHA‌-256
  checksum using their favourite offline tool (openssl, sha256sum, etc)
  or online (https://hash.online-convert.com/sha256-generator, http://convertstring.com/Hash/SHA256, https://www.xorbin.com/tools/sha256-hash-calculator,
  https://www.gigacalculator.com/calculators/sha256-online-generator.php, https://www.freeformatter.com/hmac-generator.html, etc).
  
