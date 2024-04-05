import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable ('requirements', (table) =>{
        table.uuid('id').primary()
        table.text('Name').notNullable()              //nome do solicitante
        table.text('Link').notNullable()              //vínculo >>se o solicitante é da UFBA ou externo
        table.text('Type').notNullable() // Equipamento ou servico
        table.date('timeStart').notNullable()
        table.date('timeEnd').notNullable()
        table.text('status').notNullable()            // status => pending (equipamento N-devolvido)/closed (equipamento devolvido)
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('requirements')
}

