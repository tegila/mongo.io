const nacl = require('tweetnacl');
const dec = nacl.util.decodeBase64;

const mongo = require('./mongo');

/* https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder  */
function str2ab(str) {
  var buf = new Uint8Array(str.length); // 2 bytes for each char
  for (var i = 0; i < str.length; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
}

export const __authorize__ = (socket, data) => {
  // AUTHORIZATION LOGIC 
  const payload_hash = nacl.hash(str2ab(JSON.stringify(data.payload)));
  const q = socket.handshake.query;
  const _first = nacl.sign.detached.verify(payload_hash, dec(data.signature), dec(q.pubkey));
  
  const _second = socket.__auth__.restrictions.some((rule) => {
    if (!data.action) return false;
    // caso encontre o caminho no perfil do usuario
    const regex = new RegExp(rule.path);
    if (regex.test(data.path)) {
      // confere agora se tem permissão de leitura e/ou escrita
      if (data.action === 'query' || data.action === 'lastOne') {
        return (rule.permission.indexOf('r') !== -1);
      } else {
        return (rule.permission.indexOf('w') !== -1);
      }
    }
  });
  return _first && _second;
}

export const __check_signature__ = (message, signature, pubkey) => {
  return true;

  const signature_is_valid = nacl.sign.detached.verify(
    str2ab(message), dec(signature), dec(pubkey)
  );

  if (!signature_is_valid) {
    const err = new Error('Signature isn\'t valid !!');
    console.log(err);
    return false;
  }
  return true;
}

export const __profile__ = (pubkey, callback) => {
  const coll = mongo.select_collection("__auth__", "Profiles");
  return mongo.findOne(coll, { pubkeys: pubkey }, callback);
}
