import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table) => {
        table.uuid('id').primary()
        table.string('name').notNullable()
        table.string('last_name').notNullable()
        table.string('password').notNullable()
        table.string('email').notNullable()
        table.string('phone').notNullable()
        table.string('institution').notNullable()
        table.enum('type', ['1', '2', '3']).notNullable().defaultTo('3')
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users')
}

