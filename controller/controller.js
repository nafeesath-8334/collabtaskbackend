
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../schema/userSchema');
const { Resend } = require('resend');
const Team = require('../schema/teamSchema');
const Project = require('../schema/projectSchema');
const Task = require('../schema/taskSchema');
/* REGISTER USER */
exports .register=async(req,res)=>{
    const user=req.body
    const{name,email,password,role}=user
    try{
        const existingUser=await User.findOne({email: email})
        if(existingUser){
            return res.status(400).json({message: "User already exists"})
        }   
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser= new User({
            name,
            email,
            password:hashedPassword,
            role: role,
        })
        await newUser.save()
        res.status(201).json({message:"User registered successfully", User: newUser})
    }
    catch(error){
        console.error("Error registering user:", error)
        res.status(500).json({message: "Internal server error"})
    }
}
/* LOGIN USER */


exports.login = async (req, res) => {
    const { email, password } = req.body; // Keep your uppercase keys if your frontend sends them this way

    try {
        // Find user and exclude password from returned object
        const existingUser = await User.findOne({ email: email }).select('+password'); 
        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare entered password with stored hash
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT with user ID and role for RBAC
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(
            { id: existingUser._id, role: existingUser.role },
            secretKey,
            { expiresIn: '1h' }
        );

        // Respond with safe user details (no password)
        return res.status(200).json({
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            profilePicture: existingUser.profilePicture,
            token
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

/* GET USERDETAILS */

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id) // ✅ using params.id now
     .select("-password")
    //   .populate("teams", "name")
    //   .populate("projects", "title");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ data: user }); // wrapped in { data: ... } for frontend consistency
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* FORGOT PASSWORD */
exports.forgotPswd = async (req, res) => {
    try {
        const { email } = req.body
        // console.log("email",Email)
        const usrs = await User.findOne({email:email})
        // console.log(usrs)
        if (!usrs) return res.status(200).send("if the user exist,emailwill be send")
        const token = crypto.randomBytes(32).toString('hex')
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
        usrs.resetPasswordToken = hashedToken;
        usrs.resetPasswordExpires = Date.now() + 360000;
        await usrs.save()
        const resetLink = `http://localhost:5173/resetPassword/${token}`
        const resend = new Resend('re_fFuNFZVf_2xrSAEyn5E7YLCgUxZEeg7P6')
        try {
            const { data, error } = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Reset Password',
                html: `<p>This is the link to reset Your Password<strong>Link:</strong>${resetLink}</p>`
            });
            // console.log("data", data)
            console.log("error", error)
        } catch (error) {
            console.error(error); // Good to log the actual error
            res.status(500).json({ error: 'Failed to send email !!' });
        }

    } catch (error) {
        console.error(error); // Good to log the actual error
        res.status(500).json({ error: 'Failed to update ad' });
    }
    return res.status(200).json({ message: "Password reset link sent" });

}
exports.resetPassword = async (req, res) => {
    const { token } = req.params; // Token from URL
    const { Password } = req.body; // New password from the request body
    console.log(Password)
    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const users = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Check if token is expired
        });
        console.log(User)
        console.log(users)
        if (!users) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Update user password and remove reset token
        users.password = hashedPassword;
        users.resetPasswordToken = undefined;
        users.resetPasswordExpires = undefined;
        await users.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}
/* GET USERDETAILS */
exports.fetchUserDetails = async (req, res) => {
  try {
    const users = await User.find(
      { role: "Member" },
      "name"             
    );
   
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};


/*CREATE TEAM */
exports.createTeam = async (req, res) => {
  try {
    const { teamName, teamDescription, teamMembers } = req.body;
const ownerId = req.user.id; // comes from jwtMiddleware

    // Create the team
    const newTeam = new Team({
      name: teamName,
      description: teamDescription,
      owner: ownerId,
      members: [
        { user: ownerId, role: "admin" },
        ...teamMembers.map((id) => ({ user: id, role: "member" })),
      ],
      status: "accepted", // created teams start active
    });

    const savedTeam = await newTeam.save();

    // Optionally, add team reference to each user's profile
    await User.updateMany(
      { _id: { $in: [ownerId, ...teamMembers] } },
      { $addToSet: { teams: savedTeam._id } }
    );


    res.status(201).json({
      message: "Team created successfully",
      team: savedTeam,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating team", error: error.message });
  }
};
/* GET ALL TEAMS */
exports.fetchTeam = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const teams = await Team.find({
      $or: [
        { owner: ownerId },
        { "members.user": ownerId } // Check if user is a member of the team
      ]
    })
      

    res.json({ teams });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching teams",
      error: error.message
    });
  }
};


/* ADD PROJECT  */


exports.addProject = async (req, res) => {
    try {
    const { title, description, teamId, deadline } = req.body;
    const ownerId = req.user.id;

    let members = [];

    // If linked to a team, include its members
    if (teamId) {
      const team = await Team.findById(teamId).populate("members.user");
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      members = team.members.map((m) => m.user._id);
    }

    const newProject = new Project({
      title,
      description,
      owner: ownerId,
      team: teamId || null,
      members,
      deadline,
    });

    const savedProject = await newProject.save();

    res.status(201).json({
      message: "Project created successfully",
      project: savedProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Error creating project", error: error.message });
  }
};
   

/* GET ALL PROJECT */
exports.fetchProject = async (req, res) => {

  try {
    const ownerId = req.user.id;
    const projects = await Project.find({
      $or: [
        { owner:ownerId },
        { members: req.user._id|| ownerId } // Check if user is a member of the project
      ]
    })
    .populate('owner', 'name email')
    .populate('members', 'name email')
    .populate('tasks')
    .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


/* GET PROJECT BY ID */
exports.getProjectById = async (req, res) => {
 try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate({
        path: 'tasks',
        populate: {
          path: 'assignedTo',
          select: 'name email'
        }
      });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access to this project
    // const hasAccess = project.owner._id.toString() === req.user._id.toString() ||
    //                  project.members.some(member => member._id.toString() === req.user._id.toString());

    // if (!hasAccess) {
    //   return res.status(403).json({ message: 'Access denied' });
    // }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }

};

/*ADD TASK  */
exports.addTask = async (req, res) => {
 
try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and Project are required" });
    }

    // Ensure project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const newTask = new Task({
      title,
      description,
      project: projectId,
      assignedTo: assignedTo || null,
      createdBy: req.user.id, // user from jwtMiddleware
      dueDate,
    });

    await newTask.save();
    return res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


  
