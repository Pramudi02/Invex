const { sequelize, testConnection, syncDatabase, Item } = require('../models');

const sampleItems = [
  {
    name: 'Laptop - Dell XPS 15',
    description: 'High-performance laptop with Intel i7 processor, 16GB RAM, 512GB SSD',
    quantity: 15,
    price: 1299.99
  },
  {
    name: 'Wireless Mouse - Logitech MX Master 3',
    description: 'Ergonomic wireless mouse with precision scrolling',
    quantity: 45,
    price: 99.99
  },
  {
    name: 'Mechanical Keyboard - Keychron K2',
    description: 'Compact 75% wireless mechanical keyboard with RGB backlight',
    quantity: 30,
    price: 79.99
  },
  {
    name: 'Monitor - LG 27" 4K',
    description: '27-inch 4K UHD IPS monitor with HDR support',
    quantity: 8,
    price: 449.99
  },
  {
    name: 'USB-C Hub - Anker 7-in-1',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader',
    quantity: 60,
    price: 39.99
  },
  {
    name: 'Webcam - Logitech C920',
    description: 'Full HD 1080p webcam with stereo audio',
    quantity: 5,
    price: 79.99
  },
  {
    name: 'Headphones - Sony WH-1000XM4',
    description: 'Wireless noise-canceling headphones with 30-hour battery',
    quantity: 20,
    price: 349.99
  },
  {
    name: 'External SSD - Samsung T7 1TB',
    description: 'Portable external SSD with USB 3.2 Gen 2 support',
    quantity: 25,
    price: 159.99
  },
  {
    name: 'Desk Lamp - BenQ ScreenBar',
    description: 'Monitor-mounted LED desk lamp with auto-dimming',
    quantity: 12,
    price: 109.99
  },
  {
    name: 'Cable Management Kit',
    description: 'Complete cable management solution with clips and sleeves',
    quantity: 100,
    price: 19.99
  }
];

const seedItems = async () => {
  try {
    await testConnection();
    console.log('✅ Database connection established successfully');

    await syncDatabase(false);
    console.log('✅ Database synced successfully');

    // Check if items already exist
    const existingItems = await Item.count();
    if (existingItems > 0) {
      console.log('⚠️  Items already exist in database. Skipping seed...');
      console.log(`📦 Current item count: ${existingItems}`);
      process.exit(0);
    }

    // Create sample items
    const createdItems = await Item.bulkCreate(sampleItems);

    console.log('═══════════════════════════════════════');
    console.log('✅ Sample items created successfully!');
    console.log('═══════════════════════════════════════');
    console.log(`📦 Total items created: ${createdItems.length}`);
    console.log('\n📋 Sample items:');
    createdItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - Qty: ${item.quantity} - $${item.price}`);
    });
    console.log('═══════════════════════════════════════');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding items:', error);
    process.exit(1);
  }
};

seedItems();