const bcrypt = require('bcryptjs');

// Replace 'your_admin_password' with the password you want to use
const password = 'iamthestoreadmin';

bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) throw err;
    console.log('Hashed Password:', hashedPassword);
});
