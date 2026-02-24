const bcrypt = require('bcryptjs');

const password = 'admin123';
const saltRounds = 10;

const hash = bcrypt.hashSync(password, saltRounds);
console.log('Your password hash:', hash);

// $2b$10$/sLv8DenRm7d6jleukdxmubKZUtlnDjpf06h/1BRLnIWwQxtcJtm2