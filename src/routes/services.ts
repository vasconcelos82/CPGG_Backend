//Rota utilizada para adicionar serviços ao banco de dados
import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function ServiceRoutes(app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const createServiceBodySchema = z.object({
            name: z.string(),
            laboratory: z.string(),
            price_UFBA: z.number(),
            price_external: z.number(),
        })

        const {
            name,
            laboratory,
            price_UFBA,
            price_external,
        } = createServiceBodySchema.parse(request.body)

        await knex('service')
            .insert({
                id: randomUUID(),
                name,
                laboratory,
                price_UFBA,
                price_external,
            })

        return reply.status(201).send()
    })

    // Permite listar os serviços
    app.get('/', async () => {
        const service = await knex('service').select()

        return {
            service,
        }
    })


    //Permite atualizar dados de um equipamento
    app.put('/', async (request, reply) => {
        const updateServicesBodySchema = z.object({
            id: z.string().uuid(),
            name: z.string().optional(),
            laboratory: z.string().optional(),
            price_UFBA: z.number().optional(),
            price_external: z.number().optional(),
        });

        const {
            id,
            name,
            laboratory,
            price_UFBA,
            price_external,
        } = updateServicesBodySchema.parse(request.body);



        try {
            const service = await knex('service').where('id', id).first();

            if (!service) {
                reply.code(401).send('Service not found!');
                return;
            } else
                //Atualizar os campos 
                await knex('service')
                    .where('id', id)
                    .update({
                        name,
                        laboratory,
                        price_UFBA,
                        price_external,
                    });

        } catch (error) {
            console.error('Error updating service:', error);
            reply.code(500).send('Internal server error.');
            return;
        }


    })

    // Permite deletar um serviço
    app.delete('/:id', async (request, reply) => {
        const deleteServiceBodySchema = z.object({
            id: z.string().uuid()
        })

        const { id } = deleteServiceBodySchema.parse(request.params)

        try {
            const equipment = await knex('service').where('id', id).first();

            if (!equipment) {
                reply.code(401).send('Service does not exist');
                return;
            }

            await knex('Service')
                .where('id', id)
                .delete()

        } catch (error) {
            console.error('Error deleting service:', error);
            reply.code(500).send('Internal server error.');
            return;
        }
    })
}