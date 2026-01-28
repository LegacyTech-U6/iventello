// const bcrypt = require('bcrypt');

// const password = 'Fillin';
// const hash = bcrypt.hashSync(password, 10);

// console.log(hash);

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres', // ou 'mysql' selon ton cas
});

async function test() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion réussie !');
  } catch (error) {
    console.error('❌ Erreur détaillée :', error);
  } finally {
    await sequelize.close();
  }
}

test();