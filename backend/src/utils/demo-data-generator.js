// demo-data-generator.js
const { faker } = require('@faker-js/faker');
const db = require('../config/db');
const bcrypt = require('bcrypt');

class DemoDataGenerator {
  constructor() {
    this.entreprises = [];
    this.users = [];
    this.categories = [];
    this.suppliers = [];
    this.products = [];
    this.clients = [];
    this.workers = [];
    this.roles = [];
  }

  async generateAll() {
    try {
      console.log('🚀 Début de la génération des données de démo...');

      await this.generateRoles();
      await this.generateUsers();
      await this.generateEntreprises();
      await this.generateCategories();
      await this.generateSuppliers();
      await this.generateProducts();
      await this.generateClients();
      await this.generateWorkers();
      await this.generateSales();
      await this.generateInvoices();

      console.log('✅ Toutes les données de démo ont été générées avec succès!');
    } catch (error) {
      console.error('❌ Erreur lors de la génération:', error);
    }
  }

  async generateRoles() {
    console.log('👥 Génération des rôles...');
    const rolesData = [
      { name: 'Administrateur', description: 'Accès complet au système' },
      { name: 'Gérant', description: 'Gestion complète de l\'entreprise' },
      { name: 'Vendeur', description: 'Gestion des ventes et clients' },
      { name: 'Responsable Stock', description: 'Gestion des stocks et commandes' },
      { name: 'Caissier', description: 'Encaissement et point de vente' }
    ];

    this.roles = await db.roles.bulkCreate(rolesData, { returning: true });
  }

  async generateUsers() {
    console.log('👤 Génération des utilisateurs...');
    const usersData = [
      {
        username: 'admin_demo',
        Last_name: 'Dupont',
        email: 'admin@stockly.demo',
        telephone: faker.phone.number(),
        password_hash: await bcrypt.hash('password123', 10),
        is_active: true,
        type: 'admin'
      },
      {
        username: 'gerant_tech',
        Last_name: 'Martin',
        email: 'gerant@stockly.demo',
        telephone: faker.phone.number(),
        password_hash: await bcrypt.hash('password123', 10),
        is_active: true,
        type: 'worker'
      }
    ];

    this.users = await db.User.bulkCreate(usersData, { returning: true });
  }

  async generateEntreprises() {
    console.log('🏢 Génération des entreprises...');
    const entreprisesData = [
      {
        name: 'TechStore Pro',
        description: 'Magasin spécialisé en high-tech et informatique',
        email: 'contact@techstore.demo',
        telephone: faker.phone.number(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        country: 'France',
        logo_url: null,
        user_id: this.users.find(u => u.username === 'admin_demo').id
      },
      {
        name: 'BioMarket',
        description: 'Produits biologiques et naturels',
        email: 'contact@biomarket.demo',
        telephone: faker.phone.number(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        country: 'France',
        logo_url: null,
        user_id: this.users.find(u => u.username === 'gerant_tech').id
      }
    ];

    this.entreprises = await db.Entreprise.bulkCreate(entreprisesData, { returning: true });
  }

  async generateCategories() {
    console.log('📂 Génération des catégories...');

    const categoriesData = [];

    const categoriesByEntreprise = {
      'TechStore Pro': ['Ordinateurs Portables','Smartphones','Accessoires','Composants PC','Périphériques'],
      'BioMarket': ['Fruits & Légumes','Épicerie Sèche','Produits Laitiers','Boissons','Hygiène & Beauté']
    };

    for (const [entrepriseName, names] of Object.entries(categoriesByEntreprise)) {
      const entreprise = this.entreprises.find(e => e.name === entrepriseName);
      names.forEach(name => categoriesData.push({
        name,
        description: `Catégorie ${name}`,
        entreprise_id: entreprise.id
      }));
    }

    this.categories = await db.Category.bulkCreate(categoriesData, { returning: true });
  }

  async generateSuppliers() {
    console.log('🏭 Génération des fournisseurs...');

    const suppliersData = [
      {
        supplier_name: 'TechDistrib',
        email: 'contact@techdistrib.fr',
        telephone: faker.phone.number(),
        whatsapp_number: faker.phone.number(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        preferred_channel: 'email',
        entreprise_id: this.entreprises.find(e => e.name === 'TechStore Pro').id
      },
      {
        supplier_name: 'MobileWorld',
        email: 'orders@mobileworld.com',
        telephone: faker.phone.number(),
        whatsapp_number: faker.phone.number(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        preferred_channel: 'whatsapp',
        entreprise_id: this.entreprises.find(e => e.name === 'TechStore Pro').id
      },
      {
        supplier_name: 'BioFournisseur FR',
        email: 'contact@biofournisseur.fr',
        telephone: faker.phone.number(),
        whatsapp_number: null,
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        preferred_channel: 'email',
        entreprise_id: this.entreprises.find(e => e.name === 'BioMarket').id
      }
    ];

    this.suppliers = await db.Supplier.bulkCreate(suppliersData, { returning: true });
  }

  async generateProducts() {
    console.log('📦 Génération des produits...');
    const productsData = [
      {
        Prod_name: 'MacBook Pro 14" M2',
        description: 'Ordinateur portable Apple avec puce M2',
        cost_price: 1899.99,
        selling_price: 2299.99,
        quantity: 15,
        min_stock: 5,
        category_id: this.categories.find(c => c.name === 'Ordinateurs Portables').id,
        supplier_id: this.suppliers.find(s => s.supplier_name === 'TechDistrib').id,
        entreprise_id: this.entreprises.find(e => e.name === 'TechStore Pro').id,
        Prod_image: null
      },
      {
        Prod_name: 'iPhone 15 Pro',
        description: 'Smartphone Apple dernière génération',
        cost_price: 899.99,
        selling_price: 1159.99,
        quantity: 25,
        min_stock: 8,
        category_id: this.categories.find(c => c.name === 'Smartphones').id,
        supplier_id: this.suppliers.find(s => s.supplier_name === 'MobileWorld').id,
        entreprise_id: this.entreprises.find(e => e.name === 'TechStore Pro').id,
        Prod_image: null
      },
      {
        Prod_name: 'Pommes Bio Golden',
        description: 'Pommes biologiques Golden',
        cost_price: 2.99,
        selling_price: 4.50,
        quantity: 120,
        min_stock: 30,
        category_id: this.categories.find(c => c.name === 'Fruits & Légumes').id,
        supplier_id: this.suppliers.find(s => s.supplier_name === 'BioFournisseur FR').id,
        entreprise_id: this.entreprises.find(e => e.name === 'BioMarket').id,
        Prod_image: null
      }
    ];

    this.products = await db.Product.bulkCreate(productsData, { returning: true });
  }

  async generateClients() {
    console.log('👥 Génération des clients...');
    const clientsData = [
      {
        client_name: 'SARL TechSolutions',
        email: 'contact@techsolutions.fr',
        telephone: faker.phone.number(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        type: 'Entreprise',
        entreprise_id: this.entreprises.find(e => e.name === 'TechStore Pro').id
      },
      {
        client_name: 'Marie Lambert',
        email: 'marie.lambert@email.com',
        telephone: faker.phone.number(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        type: 'Particulier',
        entreprise_id: this.entreprises.find(e => e.name === 'TechStore Pro').id
      }
    ];

    this.clients = await db.Client.bulkCreate(clientsData, { returning: true });
  }

  async generateWorkers() {
    console.log('👨‍💼 Génération des employés...');
    const workersData = [
      {
        name: 'Thomas Moreau',
        email: 'thomas.moreau@techstore.demo',
        position: 'Responsable Magasin',
        status: 'active',
        entreprise_id: this.entreprises.find(e => e.name === 'TechStore Pro').id,
        role_id: this.roles.find(r => r.name === 'Gérant').id,
        user_id: this.users.find(u => u.username === 'admin_demo').id
      }
    ];

    this.workers = await db.Worker.bulkCreate(workersData, { returning: true });
  }

  async generateSales() {
    console.log('💰 Génération des ventes...');
    await db.Sales.create({
      product_id: this.products.find(p => p.Prod_name === 'MacBook Pro 14" M2').id,
      quantity_sold: 2,
      total_price: 4599.98,
      total_profit: 800.00,
      entreprise_id: this.entreprises.find(e => e.name === 'TechStore Pro').id
    });
  }

  async generateInvoices() {
    console.log('🧾 Génération des factures...');
    const invoice = await db.Invoice.create({
      client_id: this.clients.find(c => c.client_name === 'SARL TechSolutions').id,
      entreprise_id: this.entreprises.find(e => e.name === 'TechStore Pro').id,
      total: 5399.93,
      discount: 100.00,
      reduction_type: 'fixed',
      tax: 1079.99,
      general_total: 6379.92,
      notes: 'Commande pour équipement nouvelle équipe',
     status: 'pending',        // au lieu de 'paid'
payment_method: 'cash',
      date_echeance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    await db.InvoiceItem.bulkCreate([
      {
        facture_id: invoice.id,
        product_id: this.products.find(p => p.Prod_name === 'MacBook Pro 14" M2').id,
        quantity: 1,
        unit_price: 2299.99,
        tva: 20.0,
        discount: 0
      }
    ]);
  }
}

// Pour exécuter directement le script
if (require.main === module) {
  (async () => {
    const generator = new DemoDataGenerator();
    await generator.generateAll();
    process.exit(0);
  })();
}

module.exports = DemoDataGenerator;
