
# redux-store-mongodb

> tweetnacl + socketio + mongoclient 
> Redux Store Persistence Layer using mongodb


# Installing 

The command below it is going to generate a file containing an RSA key.

> openssl genrsa 1024 > cert.pem
Here you will be asked to input data but you can leave blank pressing enter until the crs.pem is generated.

> openssl req -new -key cert.pem -out cert_csr.pem
Then a file.crt file will be created containing an SSL certificate.

> openssl x509 -req -days 365 -in cert_csr.pem -signkey cert.pem -out cert.crt

