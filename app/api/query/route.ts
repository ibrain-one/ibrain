import mysql from 'mysql';
import { promisify } from 'util';

// Create a MySQL connection pool (recommended for handling multiple connections)
const pool = mysql.createPool({
  host: '172.17.0.2',
  user: 'root',
  password: 'example',
  database: 'testdb'
});

// Promisify the pool.query method so we can use async/await
const poolQuery = promisify(pool.query).bind(pool);

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { query } = await req.json();

    if (!query) {
      return new Response(JSON.stringify({ error: 'No query provided.' }), { status: 400 });
    }

    // Execute the query using the promisified pool.query method
    const results = await poolQuery(query);

    return new Response(JSON.stringify({
      message: 'Query executed successfully',
      results,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error:any) {
    console.error('Failed to execute query:', error);
    return new Response(JSON.stringify({
      error: 'Failed to execute query',
      details: error.message,
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
