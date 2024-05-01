import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('service', (table) => {
        table.uuid('id').primary()
        table.string('name').notNullable()
        table.string('laboratory').notNullable()
        table.string('price_UFBA').notNullable()
        table.string('price_external').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('service')
}

