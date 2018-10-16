# What is mongo.io ?

Mongo.io is separated between two projects:
 - *Backend* interface for mongodb database plus a layer of crypto validation.
 - *Client* Delicious ES6 Browser or Node.js implementation.

We use Digital Signature Algorithm (DSA) to validate the communications between the client-server, on EVERY message. Using this way the server can know if the client is able to execute the procedure he wants without all those *OAUTH* procedures that normally delay the projects ALOT.

The server only had the Pubkey and a restrictions table which give the user permission rules to access the data.

The connection string is also signed (DSA) by the client and checked by the server authorization rules. The same will happen to every message sent to the server.

This project has only 3 dependencies and the purpose is to *keep it simple*:
 - TweetNaCl
 - Socket.io
 - MongoClient (Native driver).

During this research we consider using the Firebase from Google and still using it for notification and other critical usages but avoided it for simple CRUD instructions.

On the backend we have the good old MongoDB and all the ecosystem that come with it.

The most important part of this research was about not over complexify the application using **previous declarations of data objects**, **complex connection setup** and **low learning curve projects like GraphQL**.

So now we can use the database without caring too much about data structure. 

P.S.: 
1. Data Structure is a good thing, I'm only trying to avoid a deep delay in starting projects.
2. MongoDB is good but we are also looking into changing it to RethinkDB.

# Axioms:

1. No object pre-definition. (No config at all)
2. Auth & ACL straightforward (DSA).
3. CRUD chainnable code (Java Style)

# Installing (Docker way)

> Pull it from docker hub:

`docker pull tegila/mongoio`

> Or build it yourself:

`docker-compose up --build -d`

# Browser Trickies:

Google Chrome don't allow calls to localhost with self-signed (aka. development) certificate.
Circunvent this by enabling the following flag:

chrome://flags/#allow-insecure-localhost

# Using it:

```javascript
import { queryBuilder, wss } from 'mongo.io';

// Pagination 
const query = queryBuilder("database/students")
 .find({ age: { $lt: 18 } })
  .sort({ age: -1 })
  .skip(10)
  .limit(100);
  
wss.send(query, (students) => {
 console.log(students);
});
```

# Installing (Old way)

> The command below it is going to generate a file containing an RSA key.

`openssl genrsa 1024 > cert.pem`

> Here you will be asked to input data but you can leave blank pressing enter until the crs.pem is generated.

`openssl req -new -key cert.pem -out cert_csr.pem`

> Then a file.crt file will be created containing an SSL certificate.

`openssl x509 -req -days 365 -in cert_csr.pem -signkey cert.pem -out cert.crt`

`node index.js --harmony --use_strict`

[Reference](https://medium.com/@dai_shi/tail-call-optimization-tco-in-node-v6-e2492c9d5b7c)

# Testing 

Use the test.js inside the server/ and check if everything installed fine.
It will also give you an idea about how it works.

# FAQ

> Why not use GraphQL?

1. It don't fit well with JS as all the objects are self-declared and don't need redundant code for doing simple CRUD operations.
2. I feel it's still very beta software and without environment infrastructure as the old good ones. MySQL is perfect at this point but it still need object pre-declaration.
