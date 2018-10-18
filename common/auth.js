const nacl = require('tweetnacl');
const util = require('tweetnacl-util');
const utils = require('./utils');

const enc = util.encodeBase64;
const dec = util.decodeBase64;

const Auth = () => {
  const keypair = null;
  return {
    get_secretKey: () => keypair.secretKey,
    init_keypair: (secretKey) => {
      keypair = secretKey ? 
        nacl.sign.keyPair.fromSecretKey(
          dec(secretKey)
        ) : nacl.sign.keyPair();
    },
    sign_message: (message) => {
      return nacl.sign.detached(
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
        self.sign_message_hash(transaction)
      );
    },
    check_signature: (message, signature, pubkey) => {    
      return nacl.sign.detached.verify(
        self.hash_message(message),
        dec(signature),
        dec(pubkey)
      );
    }
  }
};

module.exports = Auth;