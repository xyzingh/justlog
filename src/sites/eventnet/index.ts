import * as Koa from 'koa'
import * as path from 'path'
import * as serve from 'koa-static'

const app = new Koa()

app.use((serve('./public/eventnet')))

export default app