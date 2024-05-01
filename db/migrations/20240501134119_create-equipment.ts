import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('equipment', (table) => {
        table.uuid('id').primary()
        table.string('name').notNullable()
        table.string('laboratory').notNullable()
        table.string('price_UFBA').notNullable()
        table.string('price_external').notNullable()
        table.string('quantity').notNullable()
        table.string('status').notNullable()

    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('equipment')
}

