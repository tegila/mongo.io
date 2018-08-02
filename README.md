# Who am I?

O mongo.io é formado por 2 programas: "backend" que trabalha junto com o mongoDB e "client" (frontend) que funciona como uma biblioteca para node.js ou para o browser.

Este sistema tem vários pontos de entrada, que são conhecidos como endpoints. O programa "client" se conecta nesses endpoints e escolhe qual operação ele quer executar. Atualmente existem 5 operações: SAVE, REMOVE, QUERY, FINDONE e UPDATE.

O mongo.io utiliza uma assinatura digital (DSA) em todas as mensagens enviadas do frontend para o backend, inclusive na conexão, para que o servidor consiga verificar se o cliente realmente tem autorização para salvar, alterar ou excluir qualquer informação do banco de dados. Essa autorização utiliza duas etapas de verificação: chave pública e assinatura. A combinação de ambas autoriza ou não a ação do cliente.

Para isso, estão sendo utilizadas 3 bibliotecas: nacl (criptografia) + socketio (conexão) + mongoclient (persistência - interface com o banco de dados).

Foi avaliada a possibilidade de usar o Firebase do Google, mas este se mostrou limitado, pois não permite a integração com outras ferramentas. Montar o próprio sistema deu a abertura necessária para essa integração.

Está sendo utilizado o mongoDB, que é um banco de dados noSQL, cuja forma de armazenamento não é tabelar, como o Excel. A estrutura de dados hierárquica (árvore) possibilita salvar objetos inteiros, conforme eles aparecem no programa feito em javascript. O noSQL se preocupa apenas em salvar a informação, não importando a forma como ela será salva. Isso permite a utilização de dados complexos sem precisar padronizá-los. Após salvar o dado, ele retorna um id para poder localizá-lo futuramente.

O mongoDB tem atendido as necessidades do sistema, mas está sendo avaliada uma mudança para o RethinkDB.

# Installing 

> The command below it is going to generate a file containing an RSA key.

`openssl genrsa 1024 > cert.pem`

> Here you will be asked to input data but you can leave blank pressing enter until the crs.pem is generated.

`openssl req -new -key cert.pem -out cert_csr.pem`

> Then a file.crt file will be created containing an SSL certificate.

`openssl x509 -req -days 365 -in cert_csr.pem -signkey cert.pem -out cert.crt`
`node server.js --harmony --use_strict`

[reference](https://medium.com/@dai_shi/tail-call-optimization-tco-in-node-v6-e2492c9d5b7c)

# Using

# Testing 
chrome://flags/#allow-insecure-localhost

# FAQ
