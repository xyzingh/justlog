import * as Koa from 'koa'
import sites from './sites'

const app = new Koa()

app.use(sites())

app.listen(80)
