import { FastifyInstance } from "fastify"
import {z} from 'zod'
import {randomUUID} from 'node:crypto'
import { knex  } from '../database'

export async function UsersRoutes(app: FastifyInstance){

    //Permite criar usuários
    app.post('/', async (request, reply) => {

        const createUsersBodySchema = z.object({
         username: z.string(),
         password: z.enum(['UFBA', 'External']),
         email: z.enum(['Equipment', 'Service']),
         created_at: z.string(),
         updated_at: z.string(),
         link: z.enum(['UFBA', 'External']),
        })

        const { username, password, email, created_at, updated_at, link} = createUsersBodySchema.parse(
            request.body,
            
            )

            await knex('users')
                .insert({
                    id: randomUUID(),
                    username,
                    password,
                    email,
                    created_at,
                    updated_at,
                    link,
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