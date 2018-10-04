const nacl = require('tweetnacl');
const util = require('tweetnacl-util');
const querystring = require('querystring');
const utils = require('./utils');

const enc = util.encodeBase64;
const dec = util.decodeBase64;

let keypair = {};

const self = module.exports = {
  generate_key: () => {
    keypair = nacl.sign.keyPair();
    return keypair.secretKey;
  },
  from_secretKey: (secretKey) => {
    keypair = nacl.sign.keyPair.fromSecretKey(
      dec(secretKey)
    );
  },
  init_keychain: (secretKey) => {
    if(secretKey) {
      self.from_secretKey(secretKey);
    } else {
      self.generate_key();
    }
  },
  authenticate: (secretKey) => {      
    self.init_keychain(secretKey);
    const auth = {
      pubkey: enc(keypair.publicKey),
      message: self.sign_message(
        enc(new Date().toString())
      ),
      signature: enc(signature)
    };
    return querystring.stringify(auth)
  },
  sign_message: (message) => {
    return nacl.sign.detached(
      utils.str2ab(message), 
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
  sign_transaction: (transaction) => {
    return enc(
      self.sign_message(
        self.hash_message(transaction)
      )
    );
  },
};
