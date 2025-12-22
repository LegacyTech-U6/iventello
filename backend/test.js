const bcrypt = require('bcrypt');

const password = 'Fillin';
const hash = bcrypt.hashSync(password, 10);

console.log(hash);
