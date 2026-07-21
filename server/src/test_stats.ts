import jwt from 'jsonwebtoken';

const token = jwt.sign({ id: '1', email: 'test@example.com' }, 'fallback-secret-key-for-development', { expiresIn: '24h' });

async function testStats() {
    try {
        const res = await fetch('http://localhost:5000/api/admin/stats', {
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
