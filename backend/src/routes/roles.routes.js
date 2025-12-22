// routes/roles.routes.js
const express = require("express")
const router = express.Router()
const RolesController = require("../controller/roles.controller")

// Create a new role
router.post("/", RolesController.createRole)

// Get all roles
router.get("/", RolesController.getAllRoles)

// Get one role by ID
router.get("/:id", RolesController.getRoleById)

// Update a role
router.put("/:id", RolesController.updateRole)

// Delete a role
router.delete("/:id", RolesController.deleteRole)

module.exports = router
