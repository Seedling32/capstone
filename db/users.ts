import { hashSync } from 'bcrypt-ts-edge';

const sampleUsers = {
  users: [
    {
      firstName: 'David',
      lastName: 'Admin',
      email: 'admin@example.com',
      password: hashSync('123456', 10),
      role: 'SUPER_ADMIN',
    },
    {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: hashSync('123456', 10),
      role: 'USER',
    },
  ],
};

export default sampleUsers;
