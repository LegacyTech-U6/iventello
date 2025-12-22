// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const authenticateUser = require('../middleware/AuthenticatedUser')
const { register, login,getAccount,logout,forgotPassword,resetPassword,getProfile,changePassword,updateProfile, createUser, activateAccount } = require("../controller/user.controller");


// Route POST /auth/register
router.post("/register", register);
//Route POST /auth/login
router.post("/login", login);
router.get('/account', authenticateUser, getProfile);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', authenticateUser, changePassword);
router.put('/update-profile', authenticateUser, updateProfile);
router.get('/profile', authenticateUser, getProfile);
router.get("/activate/:token",activateAccount );
module.exports = router;
