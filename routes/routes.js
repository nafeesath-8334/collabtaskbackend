const express = require('express');
const { register, login, getProfile, forgotPswd, resetPassword, fetchUserDetails, createTeam, addProject, fetchTeam, getProjectById, fetchProject } = require('../controller/controller');
const authorize = require('../middleware/autherise');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const router = express.Router();

 router.post('/register',register)
 router.post('/login',login)
  router.post('/forgotPassword',forgotPswd)
  router.post('/resetPassword/:token',resetPassword)
router.get("/getProfile/:id", getProfile);
router.get("/fetchUserDetails",fetchUserDetails);
router.post("/addTeam",jwtMiddleware,authorize("Admin"), createTeam);
router.get("/fetchTeam",authorize(" Admin"),fetchTeam);
router.post("/addProject",jwtMiddleware,authorize("Admin"), addProject);
router.get("/getProjectById/:id", jwtMiddleware, authorize("Admin"),getProjectById)
router.get("/fetchProject", jwtMiddleware,fetchProject)
module.exports=router;