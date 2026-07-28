import jwt from 'jsonwebtoken';

const token = jwt.sign({ id: '1', email: 'test@example.com' }, 'fallback-secret-key-for-development', { expiresIn: '24h' });

const API_URL_BASE = process.env.API_URL_BASE || 'http://localhost:5000';

async function testStats() {
    try {
        const res = await fetch(`${API_URL_BASE}/api/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Data:', data);
    } catch (e) {
        console.error('Error:', e);
    }
}

testStats();
