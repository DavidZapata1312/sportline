// seeders/initialSeeder.ts
import bcrypt from 'bcrypt';
import sequelize from '../config/db.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';

const seedDatabase = async () => {
    try {
        // Sync tables
        await sequelize.sync({ force: true });
        console.log('✅ Database synced');

        // initial admin
        const adminPassword = await bcrypt.hash('Admin1234!', 10);
        const admin = await User.create({
            username: 'admin',
            email: 'admin@sportsline.com',
            password: adminPassword,
            role: 'admin',
        });
        console.log(`✅ Admin created: ${admin.username}`);

        // example products
        const products = [
            {
                name: 'Balón de fútbol Nike',
                description: 'Balón oficial de la liga, tamaño 5',
                price: 49.99,
                category: 'Fútbol',
                stock: 10,
                brand: 'Nike',
            },
            {
                name: 'Camiseta Adidas Running',
                description: 'Camiseta ligera para correr',
                price: 29.99,
                category: 'Running',
                stock: 20,
                brand: 'Adidas',
            },
            {
                name: 'Raqueta de tenis Wilson',
                description: 'Raqueta profesional, marco de carbono',
                price: 120.0,
                category: 'Tenis',
                stock: 5,
                brand: 'Wilson',
            },
        ];

        await Product.bulkCreate(products);
        console.log('✅ Sample products created');

        console.log('🎉 Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await sequelize.close();
    }
};

seedDatabase();
