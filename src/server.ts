import fastify from 'fastify'
import { env} from './env'
import { requirementsRoutes } from './routes/requirements'

const app = fastify()

app.register(requirementsRoutes, {
    prefix:'requirements',
})

app.listen ({
    port: env.PORT
}).then (() => {
    console.log('HTTP server running')
})