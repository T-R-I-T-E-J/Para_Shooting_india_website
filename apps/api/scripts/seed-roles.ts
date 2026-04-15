import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../src/users/entities/user.entity';
import { Role } from '../src/auth/entities/role.entity';
import { UserRole } from '../src/auth/entities/user-role.entity';

// Load env vars
config({ path: 'apps/api/.env' });

const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/para_shooting_db',
    entities: [User, Role, UserRole],
    synchronize: false,
    logging: true,
});

async function seedRoles() {
    try {
        console.log('Connecting to database...');
        await dataSource.initialize();
        console.log('Database connected.');

        const roleRepo = dataSource.getRepository(Role);
        const userRepo = dataSource.getRepository(User);
        const userRoleRepo = dataSource.getRepository(UserRole);

        // 1. Seed Roles
        console.log('Seeding Roles...');

        let adminRole = await roleRepo.findOneBy({ name: 'admin' });
        if (!adminRole) {
            adminRole = await roleRepo.save(roleRepo.create({
                name: 'admin',
                display_name: 'Administrator',
                description: 'System Administrator with full access',
                is_system: true,
                level: 0,
                permissions: {
                    'system:admin': true,
                    // Explicitly adding others just in case
                    'users:read': true, 'users:create': true, 'users:update': true, 'users:delete': true,
                    'roles:read': true, 'roles:create': true, 'roles:update': true, 'roles:delete': true, 'roles:assign': true,
                    'shooters:read': true, 'shooters:create': true, 'shooters:update': true, 'shooters:delete': true,
                    'competitions:read': true, 'competitions:create': true, 'competitions:update': true, 'competitions:delete': true,
                    'scores:read': true, 'scores:create': true, 'scores:update': true, 'scores:delete': true,
                    'audit:read': true
                }
            }));
            console.log('Created admin role.');
        }

        let viewerRole = await roleRepo.findOneBy({ name: 'viewer' });
        if (!viewerRole) {
            viewerRole = await roleRepo.save(roleRepo.create({
                name: 'viewer',
                display_name: 'Viewer',
                description: 'Read-only access',
                is_system: true,
                level: 10,
                permissions: {
                    'competitions:read': true,
                    'scores:read': true,
                    'shooters:read': true
                }
            }));
            console.log('Created viewer role.');
        }

        // 2. Assign Admin Role to User
        console.log('Assigning Admin Role...');
        const adminUser = await userRepo.findOneBy({ email: 'admin@psci.in' });

        if (adminUser) {
            const existingAssignment = await userRoleRepo.findOneBy({
                user_id: adminUser.id,
                role_id: adminRole.id
            });

            if (!existingAssignment) {
                await userRoleRepo.save(userRoleRepo.create({
                    user: adminUser,
                    role: adminRole,
                    assigned_at: new Date()
                }));
                console.log('Assigned admin role to user.');
            } else {
                console.log('User already has admin role.');
            }
        } else {
            console.error('Admin user not found! run seed.ts first.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Role seeding failed:', error);
        process.exit(1);
    }
}

seedRoles();
