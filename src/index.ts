import * as Koa from 'koa'
import router from './sites'

const app = new Koa()

app.use(router())

app.listen(80)
