// controllers/notification.controller.js
const db = require('../config/db')
const Notification  = db.Notification

// 🔹 Get recent notifications
exports.getRecentNotifications = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    // 🔹 Récupère les 5 dernières notifications pour l'utilisateur
    const notifications = await Notification.findAll({
      where: { user_id },
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    res.status(200).json(notifications);
  } catch (err) {
    console.error("🔥 getRecentNotifications error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const notification = await Notification.findOne({ where: { id, user_id } });
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (err) {
    console.error("🔥 markAsRead error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Optionally: Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    await Notification.update(
      { read: true },
      { where: { user_id, read: false } }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("🔥 markAllAsRead error:", err);
    res.status(500).json({ message: err.message });
  }
};
