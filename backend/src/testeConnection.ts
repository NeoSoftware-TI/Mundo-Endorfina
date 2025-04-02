import { pool } from './config/database';

async function test() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        console.log('Conexão bem-sucedida:', rows);
    } catch (err) {
        console.error('Erro na conexão:', err);
    } finally {
        pool.end();
    }
}

test();