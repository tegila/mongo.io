import nacl from 'tweetnacl';
import util from 'tweetnacl-util';
import querystring from 'querystring';

import utils from './utils';

const enc = util.encodeBase64;
const dec = util.decodeBase64;

let keypair = {};

export const generate_key = () => {
  keypair = nacl.sign.keyPair();
  return keypair.secretKey;
};

export const from_secretKey = (secretKey) => {
  keypair = nacl.sign.keyPair.fromSecretKey(
    dec(secretKey)
  );
};

export const init_keychain = (secretKey) => {
  if(secretKey) {
    from_secretKey(secretKey);
  } else {
    generate_key();
  }
};

export const authenticate = (secretKey) => {
  init_keychain(secretKey);
  const auth = {
    pubkey: enc(keypair.publicKey),
    message: sign_message(
      enc(new Date())
    ),
    signature: enc(signature)
  };
  return querystring.stringify(auth)
};

export const sign_message = (message) => {
  return nacl.sign.detached(
    utils.str2ab(message), 
    keypair.secretKey
  );
};

export const hash_message = (message) => {
  return nacl.hash(
    utils.str2ab(
      JSON.stringify(message)
    )
  )
};

export const sign_transaction = (transaction) => {
  return enc(
    sign_message(
      hash_message(transaction)
    )
  );
};