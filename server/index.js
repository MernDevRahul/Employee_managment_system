const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require('node-cron')
const authRoutes = require("./routes/authRoutes")
const projectRoutes = require("./routes/projectRoutes")
const attendanceRoutes = require('./routes/attendanceRoutes')
const leaveRoutes = require("./routes/leaveRoutes")
const salaryRoutes = require("./routes/salaryRoutes")
const userRoutes = require("./routes/userRoutes")
const notifyDueTasks = require('./cron/notifyDueTask');
const notificationRoutes = require('./routes/notificationRoutes')
dotenv.config();

const app = express();

//Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

//Routes
app.get("/",(req,res)=>{
    res.send("Employee Management System Backend Running....");
});

app.use('/api/auth',authRoutes);
app.use("/api/projects",projectRoutes);
app.use("/api/attendance",attendanceRoutes);
app.use("/api/leaves",leaveRoutes);
app.use("/api/salaries",salaryRoutes);
app.use("/api",userRoutes);
app.use('/api/notifications',notificationRoutes)

// Corn
// cron.schedule('* * * * *', ()=>{
//     console.log('[CRON] Running due task notifier...');
//     notifyDueTasks();
// });


notifyDueTasks();


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})