"use server";

import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false },
});

export interface CustomerDesign {
  id: string;
  user_id?: string;
  session_id?: string;
  sku: string;
  layers: unknown[];
  preview_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Salva um design de cliente no banco de dados
 * Retorna o ID do design salvo
 */
export async function saveCustomerDesign(data: {
  userId?: string;
  sessionId?: string;
  sku: string;
  layers: unknown[];
  previewUrl?: string;
}) {
  try {
    const design = await sql<CustomerDesign[]>`
      INSERT INTO customer_designs (
        user_id, session_id, sku, layers, preview_url
      ) VALUES (
        ${data.userId || null},
        ${data.sessionId || null},
        ${data.sku},
        ${JSON.stringify(data.layers)},
        ${data.previewUrl || null}
      )
      RETURNING *
    `;

    return { success: true, design: design[0] };
  } catch (error: unknown) {
    console.error('Error saving customer design:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Busca um design de cliente por ID
 */
export async function getCustomerDesign(id: string): Promise<CustomerDesign | null> {
  try {
    const designs = await sql<CustomerDesign[]>`
      SELECT * FROM customer_designs WHERE id = ${id} LIMIT 1
    `;
    return designs[0] || null;
  } catch (error) {
    console.error(`Error fetching customer design (${id}):`, error);
    return null;
  }
}

/**
 * Busca todos os designs de um usuário
 */
export async function getUserDesigns(userId: string): Promise<CustomerDesign[]> {
  try {
    const designs = await sql<CustomerDesign[]>`
      SELECT * FROM customer_designs 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    return designs;
  } catch (error) {
    console.error(`Error fetching user designs (${userId}):`, error);
    return [];
  }
}
