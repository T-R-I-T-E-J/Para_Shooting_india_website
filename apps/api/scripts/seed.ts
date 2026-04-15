import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Category } from '../src/categories/entities/category.entity';
import { User } from '../src/users/entities/user.entity';
import { UserRole } from '../src/auth/entities/user-role.entity';
import { Role } from '../src/auth/entities/role.entity';
import * as bcrypt from 'bcrypt';

import { Result } from '../src/results/entities/result.entity';

// Load env vars
config({ path: 'apps/api/.env' });

const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/para_shooting_db',
    entities: [Category, User, UserRole, Role, Result],
    synchronize: false, // Disable sync as we use migrations
    logging: true,
});

async function seed() {
    try {
        console.log('Connecting to database...');
        await dataSource.initialize();
        console.log('Database connected.');

        // No synchronize() call here!

        const categoryRepo = dataSource.getRepository(Category);

        console.log('Seeding Categories...');
        const categoriesToSeed = [
            { name: 'National Championship', slug: 'national-championship', page: 'results', isActive: true },
            { name: 'International', slug: 'international', page: 'results', isActive: true },
            { name: 'General Policies', slug: 'general-policies', page: 'policies', isActive: true }
        ];

        let resultCategory;

        for (const cat of categoriesToSeed) {
            let existing = await categoryRepo.findOneBy({ slug: cat.slug });
            if (!existing) {
                // Ensure unknown properties are not causing issues by creating properly if needed
                existing = await categoryRepo.save(categoryRepo.create(cat));
            }
            if (cat.slug === 'national-championship') resultCategory = existing;
        }

        console.log('Seeding User...');
        const userRepo = dataSource.getRepository(User);
        const roleRepo = dataSource.getRepository(Role);
        const userRoleRepo = dataSource.getRepository(UserRole);

        // Check if user exists
        let adminUser = await userRepo.findOneBy({ email: 'admin@psci.in' });
        
        // Ensure admin role exists (it should be from migrations)
        const adminRole = await roleRepo.findOneBy({ name: 'admin' });

        if (!adminUser) {
            // Generate hash for 'Admin@123' (User seems to expect this based on input)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Admin@123', salt);

            adminUser = await userRepo.save(
                userRepo.create({
                    first_name: 'Admin',
                    last_name: 'User',
                    email: 'admin@psci.in',
                    password_hash: hashedPassword,
                    public_id: '123e4567-e89b-12d3-a456-426614174000',
                    is_active: true
                })
            );
            console.log('Admin user created.');
        } else {
            // Update password to Admin@123 even if user exists to ensure consistency with user expectation
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Admin@123', salt);
            adminUser.password_hash = hashedPassword;
            await userRepo.save(adminUser);
            console.log('Admin user password updated to Admin@123.');
        }

        // Assign Admin Role if role exists and user doesn't have it
        if (adminRole && adminUser) {
            const hasRole = await userRoleRepo.findOneBy({ 
                user_id: adminUser.id, 
                role_id: adminRole.id 
            });
            
            if (!hasRole) {
                await userRoleRepo.save(
                    userRoleRepo.create({
                        user_id: adminUser.id,
                        role_id: adminRole.id
                    })
                );
                console.log('Admin role assigned to admin user.');
            }
        }

        console.log('Seeding Result...');
        const resultRepo = dataSource.getRepository(Result);

        const existingResult = await resultRepo.findOneBy({ stored_file_name: 'mock-file-123.pdf' });

        if (!existingResult && resultCategory && adminUser) {
            await resultRepo.save(resultRepo.create({
                title: '6th National Para Shooting Championship 2025',
                date: '2025',
                description: 'Official results for the 6th National Championship held in New Delhi.',
                file_name: '6th-national-results.pdf',
                stored_file_name: 'mock-file-123.pdf',
                file_size: 1024 * 1024 * 2,
                url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Public dummy PDF
                uploader: adminUser, // Use uploader relation instead of uploaded_by
                category: resultCategory,
                is_published: true
            }));
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
