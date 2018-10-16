const nacl = require('tweetnacl');
const util = require('tweetnacl-util');
const querystring = require('querystring');
const utils = require('./utils');

const enc = util.encodeBase64;
const dec = util.decodeBase64;

const Auth = (secretKey) => {
  const keypair = secretKey ? 
    nacl.sign.keyPair.fromSecretKey(
      dec(secretKey)
    ) : nacl.sign.keyPair();
  
  return self = {
    get_secretKey: () => keypair.secretKey,
    sign_message: (message) => {
      return nacl.sign.detached(
        // utils.str2ab(JSON.stringify(message)), 
        message,
        keypair.secretKey
      );
    },
    hash_message: (message) => {
      return nacl.hash(
        utils.str2ab(
          JSON.stringify(message)
        )
      )
    },
    sign_message_hash: (message) => {
      return self.sign_message(
        self.hash_message(message)
      );
    },
    sign_transaction: (transaction) => {
      return enc(
        self.sign_message(
          self.hash_message(transaction)
        )
      );
    },
    auth_string: () => {      
      const message = new Date().toString();
      const signature = self.sign_message_hash(message);

      return querystring.stringify({
        message,
        signature: enc(signature),
        pubkey: enc(keypair.publicKey),
      });
    },
  }
};

module.exports = Auth;