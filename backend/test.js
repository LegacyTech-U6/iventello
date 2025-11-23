const bcrypt = require('bcrypt');

const password = 'Passe123';
const hash = bcrypt.hashSync(password, 10);

console.log(hash);
