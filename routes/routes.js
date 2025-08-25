const express = require('express');
const { register, login, getProfile, forgotPswd, resetPassword, fetchUserDetails, createTeam, addProject, fetchTeam, getProjectById, fetchProject, addTask, editProfile, fetchProjectByUserId, updateProject, getTaskById, updateTask } = require('../controller/controller');
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
router.put("/updateProject/:id",jwtMiddleware,authorize("Admin"),updateProject);
router.post("/addTask",jwtMiddleware,authorize("Admin"), addTask);
router.get("/getTaskById/:id", jwtMiddleware,getTaskById)
router.put("/updateTask/:id",jwtMiddleware,authorize("Admin"),updateTask);
router.get("/fetchProjectByUserId/:id",jwtMiddleware,authorize("Member"),fetchProjectByUserId);
module.exports=router;