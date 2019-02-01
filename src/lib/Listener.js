// @flow

import http from 'http'
import Route from './Route'
import UrlParser from 'url-parse'
import matchPath from '../utils/matchPath'
import SchemaValidator from 'schema-validator'

class Listener {
  __port : number
  __sequence : Array<Object>
  constructor(sequence : Array<Object>, port : number) {
    this.__port = port
    this.__sequence = sequence
  }

  CreateServer() : void {
    const that = this
    const server = http.createServer()

    server.on('request', async function(req, res) {
      req.url = new UrlParser(req.url)

      res.json = function json(obj : Object, pretty : boolean = true) : void {
        res.setHeader('Content-Type', 'application/json;charset=utf8')
        res.end(pretty == true ? JSON.stringify(obj, null, 4) : JSON.stringify(obj))
      }

      for (let __route of that.__sequence) {
        const Routing = new __route
        const __match : Object = await matchPath(req.url.pathname, { path: await Routing.Path() });
        if (!__match) continue;
        
        const RequestBody = {
          ...(!req.body ? {} : req.body),
          ...(!req.query ? {} : req.query)
        }

        const __validator : Object = new SchemaValidator(await Routing.InputSchema())
        const __validInfo : Object = __validator.check(RequestBody)
        if (__validInfo._error) {
          delete __validInfo._error
          res.statusCode = 400
          res.json({ error: true, ...__validInfo })
          break
        }
        else {
          req.params = __match.params
          const __Enter = () => Routing.__enter = true 
          const __Next  = () => Routing.__next  = true
          await Routing.PreEnter(req, res, __Enter)
          if (Routing.__enter) {
            await Routing.Handle(req, res, __Next)
          }
        }

        if (!Routing.__next) break
      }
    })
    
    server.listen(this.__port, function() {
      console.log('Restful API is running on port ' + server.address().port)
    })
  }
}

export default Listener