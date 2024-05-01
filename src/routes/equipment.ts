import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function EquipmentRoutes(app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const createEquipmentBodySchema = z.object({
            name: z.string(),
            year: z.number(),
            conservation: z.string(),
            price_UFBA: z.number(),
            price_external: z.number(),
            quantity: z.number(),
            status: z.string(),
        })

        const {
            name,
            year,
            conservation,
            price_UFBA,
            price_external,
            quantity,
            status,
        } = createEquipmentBodySchema.parse(request.body)

        await knex('equipment')
            .insert({
                id: randomUUID(),
                name,
                year,
                conservation,
                price_UFBA,
                price_external,
                quantity,
                status,
            })

        return reply.status(201).send()

    
    })

    // Permite listar os equipamentos
    app.get('/', async () => {
        const equipment = await knex('equipment').select()

        return {
            equipment,
        }
    })


    

    //Permite atualizar dados de um equipamento
    app.put('/', async (request, reply) => {
        const updateEquipmentBodySchema = z.object({
            id: z.string().uuid(),
            name: z.string().optional(),
            conservation: z.string().optional(),
            price_UFBA: z.number().optional(),
            price_external: z.number().optional(),
            quantity: z.number().optional(),
            status: z.string().optional(),
        });

        const {
            id,
            name,
            conservation,
            price_UFBA,
            price_external,
            quantity,
            status,
        } = updateEquipmentBodySchema.parse(request.body);



        try {
            const equipment = await knex('equipment').where('id', id).first();

            if (!equipment) {
                reply.code(401).send('Equipment not found!');
                return;
            }

              //Atualizar os campos 
              await knex('equipment')
              .where('id', id)
              .update({
                  name,
                  conservation,
                  price_UFBA,
                  price_external,
                  quantity,
                  status,
              });

        } catch (error) {
            console.error('Error updating equipment:', error);
            reply.code(500).send('Internal server error.');
            return;
        }
        
 
    })

    // Permite deletar um equipamento
    app.delete('/:id', async (request, reply) => {
        const deleteEquipmentBodySchema = z.object({
            id: z.string().uuid()
        })

        const { id } = deleteEquipmentBodySchema.parse(request.params)
        try {
            const equipment = await knex('equipment').where('id', id).first();

            if (!equipment) {
                reply.code(401).send('Equipment does not exist');
                return;
            }

            await knex('equipment')
                .where('id', id)
                .delete()

        } catch (error) {
            console.error('Error deleting equipment:', error);
            reply.code(500).send('Internal server error.');
            return;
        }
    })


}