const Auth = require("./auth")();
const querystring = require('querystring');

const Rules = {
  auth_string: () => {      
    const message = new Date().toString();
    const signature = auth.sign_message_hash(message);

    return querystring.stringify({
      message,
      signature: enc(signature),
      pubkey: enc(keypair.publicKey),
    });
  },
  // ACL: User has access to this path ?
  check_acl: (profile, path, action) => {
    if (!profile || !path || !action) 
      return false;

    return profile.restrictions.some((rule) => {
      // caso encontre o caminho no perfil do usuario
      const regex = new RegExp(rule.path);
      if (regex.test(path)) {
        // confere agora se tem permissão de leitura e/ou escrita
        if (action === 'query' || action === 'lastOne') {
          return (rule.permission.indexOf('r') !== -1);
        } else {
          return (rule.permission.indexOf('w') !== -1);
        }
      }
    });
  },
  authorize: (socket, data) => {
    // AUTHORIZATION LOGIC 
    const q = socket.handshake.query;

    // Signature is valid ?
    const _first = Auth.check_signature(
      data.payload, 
      data.signature,
      q.pubkey
    );
    const _second = Rules.check_acl(socket.__auth__, data.path, data.action);

    return _first && _second;
  }
};

module.exports = Rules;