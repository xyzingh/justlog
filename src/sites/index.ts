import * as Koa from 'koa'
import * as compose from 'koa-compose'
import * as fs from 'fs'

const config = require('../../config.json')

interface vhost {
    host: string,
    middleware: Koa.Middleware
}

let vhosts: vhost[] = []
let defaultSite: vhost
console.log(__dirname)
fs.readdirSync(__dirname).forEach(filename => {
    filename.charAt(0) !== '.' && fs.stat(__dirname + '/' + filename, (err, stats) => {
        if (stats.isDirectory()) {
            console.log(`Site: ${filename} detected`)
            vhosts.push({
                host: filename,
                middleware: compose(require('./' + filename + '/index').default.middleware)
            })

            if (filename === config.defaultSite)
                defaultSite = vhosts[vhosts.length - 1]
        }
    })
})


let router = () => {
    return function (ctx: Koa.Context, next: () => Promise<any>) {
        let vh: vhost
        for (let i in vhosts) {
            if (vhosts[i].host + '.' + config.rootHostname === ctx.hostname) {
                vh = vhosts[i]
                break
            }
        }

        if (vh !== void 0) {
            console.log(`Host: ${vh.host}`)
            return vh.middleware(ctx, next)
        }
        else {
            vh = defaultSite
            console.log('(Default) Access to ' + ctx.hostname)
            return vh.middleware(ctx, next)
        }
    }
}

export default router