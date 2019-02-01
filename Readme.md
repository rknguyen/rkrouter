# RK Router 🚀
About this technical:
- RKRouter is a lightweight package to create RESTful API server. 
- Code-style spirited by React.
- Written by RK Nguyen. (fb/rknguyen for support)

# Installation
This technology is released in the public npm registry and can be installed using:
```
npm install rkrouter
```

# Usage
See some examples below, it is very easy for beginners to read and approach to this technology.

#### Init routes
```javascript
const { Route, Listener } = require('rkrouter')

const Parser = require('./route/Parser')
const Hello = require('./route/Hello')
const Otherwise = require('./route/Otherwise')

const Port = 3001
const http = new Listener(
[ 
  Parser, 
  Hello, 
  Otherwise 
], 
Port)

http.CreateServer()
```

#### route/Parser
This route is similar to a middleware that parse input data before go to main route.
``` javascript
const { Route } = require('rkrouter')
const BodyParser = require('body-parser')
const QueryString = require('query-string')

class Parser extends Route {
  async Handle(req, res, next) {
    const __Parser = (parser) => new Promise((next) => parser(req, res, next))
    req.query = QueryString.parse(req.url.query)
    await __Parser(BodyParser.json())
    await __Parser(BodyParser.urlencoded({ extended: false }))
    next()
  }
}

module.exports = Parser
```

#### route/Hello
This route is just an example for main route.
This example also shows you what you can do with one route, its basically is:
- Path: define the path that match this route
- PreEnter: define some validate before handle request
- Handle: process something...
- InputSchema: Define the rules of input, it is just a schema validation
```javascript
const { Route } = require('rkrouter')

class Hello extends Route {
  async Path() { return '/hello/:name' }
  async PreEnter(req, res, enter) {
    // check something before enter the route
    // if not valid to enter, must res.end()
    enter()
  }
  async Handle(req, res, next) {
    res.statusCode = 200
    res.json({
      hello: req.params.name,
      ...{ query: req.query },
      ...{ body: req.body }
    })
  }
  async InputSchema() {
    return {
      msg: {
        type: String,
        length: {
          min: 5,
          max: 10
        }
      }
    }
  }
}

module.exports = Hello
```

#### route/Otherwise
When can't find any route match with current request, this route is the last route that shows not found message.
```javascript
const { Route } = require('rkrouter')

class Otherwise extends Route {
  async Handle(req, res) {
    res.statusCode = 404
    res.json({
      error: true,
      message: "404 not found"
    })
  }
}

module.exports = Otherwise
```

# Got problem?
Just contact me (fb/rknguyen)

# Hope you like this technology ❤️