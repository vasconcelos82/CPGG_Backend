import { FastifyInstance } from "fastify"
import {z} from 'zod'
import {randomUUID} from 'node:crypto'
import { knex  } from '../database'

export async function requirementsRoutes(app: FastifyInstance){

    // Permite fazer busca por todos os requerimentos
    app.get('/', async () => {
        const requirements = await knex('requirements').select()
        
        return {
            requirements,
        }
    })

    // Fazer busca de requerimentos pelo número id
    app.get('/:id', async (request)=>{
        const getRequirementsParamsSchema = z.object({
            id: z.string().uuid(),
        })
        const {id} = getRequirementsParamsSchema.parse(request.params)

        const requirements = await knex('requirements').where('id', id).first()

        return { requirements}
    })

    // Permite criar os requerimentos de um usuário
    app.post('/', async (request, reply) => {

        const createRequerimentsBodySchema = z.object({
         name: z.string(),
         link: z.enum(['UFBA', 'External']),
         type: z.enum(['Equipment', 'Service']),
         timeStart: z.string(),
         timeEnd: z.string(),
         status: z.enum(['pending', 'closed']),
        })

        const { name, link, type, timeStart, timeEnd, status} = createRequerimentsBodySchema.parse(
            request.body,
            
            )

            await knex('requirements')
                .insert({
                    id: randomUUID(),
                    name,
                    link,
                    type,
                    timeStart,
                    timeEnd,
                    status,
                })
    
        return reply.status(201).send()
    })

}

