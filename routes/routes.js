const express = require('express');
const { register, login, getProfile, forgotPswd, resetPassword, fetchUserDetails, createTeam, addProject, fetchTeam, getProjectById, fetchProject, addTask, editProfile, fetchProjectByUserId, updateProject, getTaskById, updateTask, updateTeam, getTeamById, deleteTeam, deleteProject, deleteTask, updateProjectStatus, updateTaskStatus, updateTaskPriority } = require('../controller/controller');
const authorize = require('../middleware/autherise');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const upload = require('../middleware/multerMiddleware');

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/forgotPassword', forgotPswd)
router.post('/resetPassword/:token', resetPassword)
router.get("/getProfile/:id", getProfile);
router.get("/fetchUserDetails", fetchUserDetails);
router.put("/editProfile/:id", jwtMiddleware, upload.single("img"), editProfile);
router.post("/addTeam", jwtMiddleware, authorize("Admin"), createTeam);
router.get("/fetchTeam", jwtMiddleware, fetchTeam);
router.put("/updateTeam/:id", jwtMiddleware, authorize("Admin"), updateTeam);
router.delete("/deleteTeam/:id", jwtMiddleware, authorize("Admin"), deleteTeam);
router.get("/getTeamById/:id", jwtMiddleware, getTeamById)
router.post("/addProject", jwtMiddleware, authorize("Admin"), addProject);
router.get("/getProjectById/:id", jwtMiddleware, getProjectById)
router.get("/fetchProject", jwtMiddleware, fetchProject)
router.put("/updateProject/:id", jwtMiddleware, authorize("Admin"), updateProject);
router.delete("/deleteProject/:id", jwtMiddleware, authorize("Admin"), deleteProject);
router.post("/addTask", jwtMiddleware, authorize("Admin"), addTask);
router.get("/getTaskById/:id", jwtMiddleware, getTaskById)
router.put("/updateTask/:id", jwtMiddleware, authorize("Admin"), updateTask);
router.delete("/deleteTask/:id", jwtMiddleware, authorize("Admin"), deleteTask);
router.get("/fetchProjectByUserId/:id", jwtMiddleware, authorize("Member"), fetchProjectByUserId);
router.put("/updateProjectStatus/:id", jwtMiddleware,authorize("Member"), updateProjectStatus);
router.put("/updateTaskStatus/:id", jwtMiddleware,authorize("Member"), updateTaskStatus);
router.put("/updateTaskPriority/:id", jwtMiddleware,authorize("Member"), updateTaskPriority);
module.exports = router;