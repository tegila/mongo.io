const nacl = require('tweetnacl');
const util = require('tweetnacl-util');
const querystring = require('querystring');
const utils = require('./utils');

const enc = util.encodeBase64;
const dec = util.decodeBase64;

let keypair = {};

const self = module.exports = {
  get_secretKey: () => {
    return keypair.secretKey
  },
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
  auth_from_secretKey: (secretKey) => {      
    self.init_keychain(secretKey);

    // const message = new Date().toString();
    // const signature = nacl.sign.detached(utils.str2ab(message), keypair.secretKey);
    
    const message = self.sign_message_hash(
      new Date().toString()
    );

    const auth = {
      signature: enc(signature),
      pubkey: enc(keypair.publicKey),
      message
    };
    return querystring.stringify(auth);
  },
};
