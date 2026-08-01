const axios = require('axios');

async function run() {
    try {
        const login = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@bellwin.com', // Assuming admin email
            password: 'password123'     // Assuming standard password
        }).catch(() => null);

        let token = '';
        if (login && login.data.token) {
            token = login.data.token;
        }

        const res = await axios.post('http://localhost:5000/api/ledgers', {
            ledgerName: 'Test Ledger XYZ',
            accountGroup: 'Assets',
            openingBalance: '',
            balanceType: 'Debit',
            branch: 'All'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log(res.data);
    } catch (err) {
        console.error('HTTP ERROR:', err.response ? err.response.data : err.message);
    }
}

run();
