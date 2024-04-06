import fastify from 'fastify'
import { env } from './env'
import { RequirementsRoutes } from './routes/requirements'
import { UsersRoutes } from './routes/users'
import { AuthRoutes } from './routes/auth'


const app = fastify()

app.register(AuthRoutes, {
    prefix: 'auth',
})

app.register(RequirementsRoutes, {
    prefix: 'requirements',
})

app.register(UsersRoutes, {
    prefix: 'users',
})

app.listen({
    port: env.PORT
}).then(() => {
    console.log('✅ HTTP Server Running on http://localhost:' + env.PORT)
})