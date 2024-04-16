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


        const user = await knex('users').where('email', email).first()

        if (user) {
            reply.code(401).send('User already exists!')
            return;
        }

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

    // Permite atualizar os dados de um usuario
    app.put('/', async (request, reply) => {
        const updateUserBodySchema = z.object({
            id: z.string().uuid(),
            name: z.string().optional(),
            last_name: z.string().optional(),
            email: z.string().email().optional().optional(),
            current_password: z.string().min(8).max(32).optional(),
            new_password: z.string().min(8).max(32).optional(),
            phone: z.number().optional(),
            institution: z.string().optional(),
        });

        const {
            id,
            name,
            last_name,
            email,
            current_password,
            new_password,
            phone,
            institution,
        } = updateUserBodySchema.parse(request.body);



        try {
            const user = await knex('users').where('id', id).first();

            if (!user) {
                reply.code(401).send('User not found!');
                return;
            }


            if ((current_password && !new_password) || (new_password && !current_password)) {

                reply.code(401).send('You need to submit your current password and new password to change your password!')
            } else if (current_password && new_password) {

                //Comparação da senha atual enviada pelo usuário com a senha salva no banco de dados
                const old_password = user.password;
                const isMatch = await bcrypt.compare(current_password, old_password);

                if (!isMatch) {
                    reply.code(401).send('The current password is incorrect!');
                    return;
                }

                // Criptografar nova senha usando bcrypt
                const new_passwordHash = await bcrypt.hash(new_password, 10);

                //Atualizar os campos alterando a senha
                await knex('users')
                    .where('id', id)
                    .update({
                        name,
                        last_name,
                        email,
                        password: new_passwordHash,
                        phone,
                        institution,
                    });

            }
            else {
                // Atualizar os campos de usuário sem alterar a senha
                await knex('users')
                    .where('id', id)
                    .update({
                        name,
                        last_name,
                        email,
                        phone,
                        institution,
                    })
            }

            return reply.status(201).send(); // Send the first element of the updated user array
        } catch (error) {
            console.error('Error updating user:', error);
            reply.code(500).send('Internal server error.');
            return;
        }

    });


    // Permite deletar um usuário
    app.delete('/', async (request, reply) => {
        const deleteUserBodySchema = z.object({
            id: z.string().uuid()
        })

        const { id } = deleteUserBodySchema.parse(request.body)

        try {
            const user = await knex('users').where('id', id).first();

            if (!user) {
                reply.code(401).send('User does not exist');
                return;
            }

            await knex('users')
                .where('id', id)
                .delete()

        } catch (error) {
            console.error('Error deleting user:', error);
            reply.code(500).send('Internal server error.');
            return;
        }
    })
}