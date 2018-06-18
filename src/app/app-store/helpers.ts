// Requirements
declare var argon2;
declare var openpgp;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// Generate a new PGP key
export async function genPgpKey(model) {
  const options = {
    numBits: 4096,
    passphrase: model.password,
    userIds: { name: `${model.username}@ctemplar.com` }
  };
  const key = await openpgp.generateKey(options);
  model.public_key = key.publicKeyArmored;
  model.private_key = key.privateKeyArmored;
  return model;
}

// Generate the PGP key object
export async function genPgpObj(password, private_key) {
  const keyObj = openpgp.key.readArmored(private_key).keys[0];
  await keyObj.decrypt(password);
  return keyObj;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// Generate a plain text message from given PGP message
export async function decrypt(content, keyObj) {
  return await openpgp
    .decrypt({
      message: openpgp.message.readArmored(content),
      privateKeys: [keyObj]
    })
    .then(msg => {
      return msg.data;
    });
}

// Generate a PGP message from given plain text message
export async function encrypt(content, public_key) {
  return await openpgp.encrypt({
    data: content,
    publicKeys: openpgp.key.readArmored(public_key).keys
  })
  .then(msg => {
    return msg.data;
  });
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// Generate a password hash
export async function genPwdHash(model) {
  const pwd = await argon2.hash({
    distPath: "/assets/argon2",
    hashLen: 33,
    mem: 1337,
    parallelism: 3,
    pass: model.password,
    salt: "33dividedby0",
    time: 33,
    type: argon2.ArgonType.Argon2i
  });
  model.password = pwd.hashHex;
  return model;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// export function loadScript(src) {
//   let node = document.createElement("script");
//   node.src = src;
//   node.async = true;
//   node.defer = true;
//   document.getElementsByTagName("head")[0].appendChild(node);
// }
