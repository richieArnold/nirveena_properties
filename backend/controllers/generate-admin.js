const bcrypt = require('bcryptjs');

const password = 'NirveenaAdmin@123';
const saltRounds = 10;

const hash = bcrypt.hashSync(password, saltRounds);

console.log(hash);