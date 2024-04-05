import { FastifyInstance } from "fastify"
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function UsersRoutes(app: FastifyInstance) {

    //Permite criar usuários
    app.post('/', async (request, reply) => {

        const createUsersBodySchema = z.object({
            name: z.string(),
            last_name: z.string(),
            password: z.string().min(8).max(32),
            email: z.string().email(),
            phone: z.number(),
            institution: z.string(),
        })

        const {
            name,
            last_name,
            password,
            email,
            phone,
            institution,
        } = createUsersBodySchema.parse(request.body)

        const hashedPassword = await bcrypt.hash(password, 10);
        await knex('users')
            .insert({
                id: randomUUID(),
                name,
                last_name,
                password: hashedPassword,
                email,
                phone,
                institution,
            })

        return reply.status(201).send()
    })

    // Permite listar os usuários
    app.get('/', async () => {
        const users = await knex('users').select()

        return {
            users,
        }
    })

    // Permite deletar um usuario

    app.delete('/', async () => {
        const users = await knex('users').select()
            .del()

        return {
            users,
        }
    })
    // Permite atualizar os dados de um usuario

    // Permite fazer busca por todos os requerimentos


}