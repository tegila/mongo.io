serializer = require("../utils/serializer")

person =
  name: "John Smith"
  age: 42
  isJohn: ->
    !!@name.match(/John/)

jsonString = JSON.stringify(person, serializer.encode)
restoredPerson = JSON.parse(jsonString, serializer.decode)
console.log restoredPerson.isJohn()