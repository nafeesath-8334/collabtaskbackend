const express = require('express');
const { register, login, getProfile, forgotPswd, resetPassword, fetchUserDetails, createTeam, addProject, fetchTeam, getProjectById, fetchProject, addTask, editProfile } = require('../controller/controller');
const authorize = require('../middleware/autherise');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const upload = require('../middleware/multerMiddleware');

const router = express.Router();

 router.post('/register',register)
 router.post('/login',login)
  router.post('/forgotPassword',forgotPswd)
  router.post('/resetPassword/:token',resetPassword)
router.get("/getProfile/:id", getProfile);
router.get("/fetchUserDetails",fetchUserDetails);
router.put( "/editProfile/:id", jwtMiddleware,upload.single("img"),editProfile);
router.post("/addTeam",jwtMiddleware,authorize("Admin"), createTeam);
router.get("/fetchTeam",jwtMiddleware,fetchTeam);
router.post("/addProject",jwtMiddleware,authorize("Admin"), addProject);
router.get("/getProjectById/:id", jwtMiddleware,getProjectById)
router.get("/fetchProject",jwtMiddleware,fetchProject)
router.post("/addTask",jwtMiddleware,authorize("Admin"), addTask);
module.exports=router;