import Client from './client.model.js';
import Product from './product.model.js';
import Delivery from './delivery.model.js';
import DeliveryItem from './deliveryItem.model.js';

// Client 1..* Delivery
Client.hasMany(Delivery, { foreignKey: 'clientId', as: 'deliveries' });
Delivery.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

// Delivery 1..* DeliveryItem
Delivery.hasMany(DeliveryItem, { foreignKey: 'deliveryId', as: 'items', onDelete: 'CASCADE' });
DeliveryItem.belongsTo(Delivery, { foreignKey: 'deliveryId', as: 'delivery' });

// Product 1..* DeliveryItem
Product.hasMany(DeliveryItem, { foreignKey: 'productId', as: 'deliveryItems' });
DeliveryItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
