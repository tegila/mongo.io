nacl = require 'tweetnacl'

enc = nacl.util.encodeBase64
dec = nacl.util.decodeBase64

msg = dec 'hello world'
hash = nacl.hash(msg)

console.log enc(hash)
