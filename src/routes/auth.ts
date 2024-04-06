import { FastifyInstance } from "fastify"
import fastifyAuth from '@fastify/auth';
import { knex } from '../database'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { env } from '../env'
import fastifyJwt from '@fastify/jwt'


export async function AuthRoutes(app: FastifyInstance) {

    const authSchema = z.object({
        email: z.string().email(),
        password: z.string()
    })

    const userPayloadSchema = z.object({
        id: z.string().uuid(),
        email: z.string().email(),
    })
    app.register(fastifyJwt, {
        secret: env.SECRET_JWT_TOKEN,
    })

    app.post('/', async (request, reply) => {

        const { email, password } = authSchema.parse(request.body)

        const user = await knex('users').where('email', email).first()

        if (!user) {
            reply.code(401).send('User not found!')
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            reply.code(401).send('Wrong user or password!');
            return;
        }

        const token = app.jwt.sign({
            payload: userPayloadSchema.safeParse({ id: user.id, email }),
        })

        reply.code(200).send(token)
    })
}