const mongoose = require('mongoose');
require('dotenv').config();

const Ledger = require('./models/accounts/Ledger');
const Counter = require('./models/Counter');

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const ledger = await Ledger.create({
            ledgerName: 'Test Ledger 1234',
            accountGroup: 'Assets',
            openingBalance: 0,
            balanceType: 'Debit',
            branch: 'All',
            description: ''
        });

        console.log('Ledger created:', ledger);
    } catch (e) {
        console.error('ERROR CREATING LEDGER:');
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

test();
