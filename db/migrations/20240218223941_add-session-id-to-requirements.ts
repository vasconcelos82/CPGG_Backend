//Exemplo de Migration somente para adicionar/deletar uma coluna nova na tabela
// Exemplo: coluna "session-id" a ser criada>> alterar se necessário

import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('requirements', (table)=> {
        table.uuid('session_id').after('id').index()

    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('requirements', (table)=> {
        table.dropColumn('session_id')
})
}
