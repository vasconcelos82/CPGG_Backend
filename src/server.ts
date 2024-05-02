import fastify from 'fastify'
import { env } from './env'
import { RequirementsRoutes } from './routes/requirements'
import { UsersRoutes } from './routes/users'
import { AuthRoutes } from './routes/auth'
import { EquipmentRoutes } from './routes/equipments'
import { ServiceRoutes } from './routes/services'


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

app.register(EquipmentRoutes, {
    prefix: 'equipments',
})

app.register(ServiceRoutes, {
    prefix: 'services',
})


app.listen({
    port: env.PORT
}).then(() => {
    console.log('✅ HTTP Server Running on http://localhost:' + env.PORT)
})