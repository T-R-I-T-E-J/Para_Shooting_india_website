import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../src/users/entities/user.entity';
import { UserRole } from '../src/auth/entities/user-role.entity';
import { Role } from '../src/auth/entities/role.entity';
import * as bcrypt from 'bcrypt';

// Load env vars
config({ path: 'apps/api/.env' });

const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/para_shooting_db',
    entities: [User, UserRole, Role],
    synchronize: false, // Do not sync, just connect
    logging: true,
});

async function resetPassword() {
    try {
        console.log('Connecting to database...');
        await dataSource.initialize();
        console.log('Database connected.');

        const userRepo = dataSource.getRepository(User);
        const adminUser = await userRepo.findOneBy({ email: 'admin@psci.in' });

        if (adminUser) {
            console.log('Found admin user. Updating password to Admin@123...');

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Admin@123', salt);

            adminUser.password_hash = hashedPassword;
            await userRepo.save(adminUser);

            console.log('Password updated successfully!');
        } else {
            console.error('Admin user not found!');
        }

        process.exit(0);
    } catch (error) {
        console.error('Password reset failed:', error);
        process.exit(1);
    }
}

resetPassword();
