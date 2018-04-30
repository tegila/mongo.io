
# redux-store-mongodb
## Redux Store Persistence Layer using mongodb

### nacl + socketio + mongoclient 


# Installing 

> The command below it is going to generate a file containing an RSA key.

`openssl genrsa 1024 > cert.pem`

> Here you will be asked to input data but you can leave blank pressing enter until the crs.pem is generated.

`openssl req -new -key cert.pem -out cert_csr.pem`

> Then a file.crt file will be created containing an SSL certificate.

`openssl x509 -req -days 365 -in cert_csr.pem -signkey cert.pem -out cert.crt`

`node server.js --harmony --use_strict`

[reference](https://medium.com/@dai_shi/tail-call-optimization-tco-in-node-v6-e2492c9d5b7c)


# Testing 

chrome://flags/#allow-insecure-localhost
