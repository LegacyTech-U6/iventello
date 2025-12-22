const sequelizeQuery = require("sequelize-query");
const db = require("../config/db");
const { sendNotification } = require('../utils/notification');
const {supabase} = require('../middleware/supabase')

const Client = db.Client;
const invoice = db.Invoice;

const queryParser = sequelizeQuery(db);

// 🔹 Récupérer tous les clients
exports.getAllClients = async (req, res) => {
  try {
    const query = await queryParser.parse(req);
    query.where = { ...query.where, entreprise_id: req.entrepriseId };

    const clients = await Client.findAll({ ...query });

    const data = await Promise.all(clients.map(async (c) => {
      const obj = c.toJSON();
      if (obj.image) obj.image = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${obj.image}`;
      
      // Get all invoices for this client
      const invoices = await db.Invoice.findAll({
        where: { client_id: c.id, entreprise_id: req.entrepriseId }
      });
      
      obj.invoices = invoices.map(inv => inv.toJSON());
      
      return obj;
    }));

    const count = await Client.count({ where: query.where });

    res.status(200).json({ count, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Récupérer un client par ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findOne({
      where: { id, entreprise_id: req.entrepriseId },
    });

    if (!client) return res.status(404).json({ message: "Client non trouvé" });

    const obj = client.toJSON();
    if (obj.image) obj.image = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${obj.image}`;

    res.status(200).json(obj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Créer un client
exports.createClient = async (req, res) => {
  try {
    const entrepriseId = req.entrepriseId;
    let fileName = null;

    if (req.file) {
      fileName = Date.now() + "-" + req.file.originalname;

      const { error } = await supabase.storage
        .from("images")
        .upload(fileName, req.file.buffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: req.file.mimetype,
        });

      if (error) throw error;
    }

    const client = await Client.create({
      ...req.body,
      entreprise_id: entrepriseId,
      image: fileName,
    });

    await sendNotification({
      type: 'client',
      message: `New client created: ${client.name}`,
      user_id: req.user?.id,
    });

    const clientJSON = client.toJSON();
    if (fileName) clientJSON.image = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${fileName}`;

    res.status(201).json(clientJSON);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Mettre à jour un client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findOne({ where: { id, entreprise_id: req.entrepriseId } });

    if (!client) return res.status(404).json({ message: "Client non trouvé" });

    if (req.file) {
      const fileName = Date.now() + "-" + req.file.originalname;

      const { error } = await supabase.storage
        .from("images")
        .upload(fileName, req.file.buffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: req.file.mimetype,
        });
      if (error) throw error;

      // Supprimer l'ancienne image si elle existe
      if (client.image) await supabase.storage.from("images").remove([client.image]);

      req.body.image = fileName;
    }

    await client.update(req.body);

    await sendNotification({
      type: 'client',
      message: `Client updated: ${client.name}`,
      user_id: req.user?.id,
    });

    const clientJSON = client.toJSON();
    if (clientJSON.image) {
      clientJSON.image = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${clientJSON.image}`;
    }

    res.status(200).json({ message: "Client mis à jour avec succès", client: clientJSON });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Supprimer un client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findOne({ where: { id, entreprise_id: req.entrepriseId } });

    if (!client) return res.status(404).json({ message: "Client non trouvé" });

    if (client.image) await supabase.storage.from("images").remove([client.image]);

    await client.destroy();

    await sendNotification({
      type: 'client',
      message: `Client deleted (ID: ${id})`,
      user_id: req.user?.id,
    });

    res.status(200).json({ message: "Client supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
