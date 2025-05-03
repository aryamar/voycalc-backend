import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Server starting...'); // لاگ برای شروع سرور

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://192.168.1.15:3000', 'https://voycalc-frontend.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.get('/test-nodb', (req, res) => {
    console.log('Received GET request to /test-nodb');
    res.json({ message: 'This is a test without database!' });
});
// لاگ برای متغیرهای محیطی
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

// Middleware برای لاگ کردن درخواست‌ها
app.use((req, res, next) => {
    console.log(`Received ${req.method} request to ${req.url} from ${req.ip}`);
    next();
});

// تنظیمات دیتابیس
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false // استفاده از گواهی SSL
    }
});

// تست اتصال به دیتابیس
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database!');
});

// مسیرهای API
app.get('/', (req, res) => {
    console.log('Handling GET request to /');
    res.json({ message: 'Welcome to voycalc-backend!' });
});

app.get('/api/test', (req, res) => {
    console.log('Handling GET request to /api/test');
    res.json({ message: 'Hello from backend!' });
});

app.get('/vsltype', (req, res) => {
    console.log('Received GET request to /vsltype');
    const query = "SELECT Vessel_Type FROM vesseltype";
    db.query(query, (err, data) => {
        if (err) {
            console.error('Error in /vsltype:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.json(data);
    });
});

// بقیه مسیرها بدون تغییر باقی می‌مونن
app.get('/calculation', (req, res) => {
    const query = 'SELECT * FROM calculation';
    db.query(query, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post('/calc', (req, res) => {
    const query = "INSERT INTO calculation (`Vessel_Name`,`Deadweight`,`Cargo_quantity`,`Vessel_Type`,`Distance`,`IFO_Qtty`,`MDO_Qtty`,`IFOAtSea`,`MDOAtSea`,`IFOAtPort`,`MDOAtPort`,`Speed_Ballast`,`IFO_Price`,`MDO_Price`,`TTL_Fuel_Price`,`PortDays`,`Steam_Days`,`Commission`,`LoadPort`,`DischargePort`,`LportDays`,`DportDays`,`LoadRate`,`DischargeRate`,`StandingCost`,`BreakEven`,`TTLDays`,`OtherExpences`,`DailyHire`,`VoyageNumber`,`min_plus_1`,`Charterer`,`LPortCost`,`DPortCost`,`AddPortDays`,`AddSteamDays`,`Commodity`,`TotalCost`,`LoadTerm`,`DischargeTerm`,`Ttl_Commission`,`Ttl_Do_Price`,`Ttl_Fo_Price`,`Speed_Laden`,`Ballast_Days`,`Laden_Days`,`Port_Status`) VALUES(?)";
    const values = [
        req.body.Vessel_Name,
        req.body.Deadweight,
        req.body.Cargo_quantity,
        req.body.Vessel_Type,
        req.body.Distance,
        req.body.IFO_Qtty,
        req.body.MDO_Qtty,
        req.body.IFOAtSea,
        req.body.MDOAtSea,
        req.body.IFOAtPort,
        req.body.MDOAtPort,
        req.body.Speed_Ballast,
        req.body.IFO_Price,
        req.body.MDO_Price,
        req.body.TTL_Fuel_Price,
        req.body.PortDays,
        req.body.Steam_Days,
        req.body.Commission,
        req.body.LoadPort,
        req.body.DischargePort,
        req.body.LportDays,
        req.body.DportDays,
        req.body.LoadRate,
        req.body.DischargeRate,
        req.body.StandingCost,
        req.body.BreakEven,
        req.body.TTLDays,
        req.body.OtherExpences,
        req.body.DailyHire,
        req.body.VoyageNumber,
        req.body.min_plus_1,
        req.body.Charterer,
        req.body.LPortCost,
        req.body.DPortCost,
        req.body.AddPortDays,
        req.body.AddSteamDays,
        req.body.Commodity,
        req.body.TotalCost,
        req.body.LoadTerm,
        req.body.DischargeTerm,
        req.body.Ttl_Commission,
        req.body.Ttl_Do_Price,
        req.body.Ttl_Fo_Price,
        req.body.Speed_Laden,
        req.body.Port_Status,
        req.body.Ballast_Days,
        req.body.Laden_Days,
    ];

    db.query(query, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post('/signup', (req, res) => {
    const q = "INSERT INTO login(`username`,`email`,`password`) VALUES(?)";
    const values = [
        req.body.username,
        req.body.email,
        req.body.password,
    ];
    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/getlogin',(req,res)=>{
    const q="SELECT * FROM login"
    db.query(q,(err,data)=> {
        if(err)return res.json(err)
            return res.json(data)
    })
})

app.get('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(email+password)
    const q = "SELECT * FROM login WHERE email = ? AND password = ?";
    db.query(q, [email, password], (err, data) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (data.length === 0) return res.status(401).json({ message: 'Invalid email or password' });
        return res.status(200).json({ message: 'Login successful', user: data[0] });
    });
});

app.get('/vsllist', (req, res) => {
    const q = 'SELECT Vessel_Name FROM calculation';
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/portstatus', (req, res) => {
    const q = "SELECT * FROM portstatus";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/commodity', (req, res) => {
    const query = 'SELECT * FROM commodity';
    db.query(query, (error, data) => {
        if (error) return res.json(error);
        return res.json(data);
    });
});

app.post("/portstate", (req, res) => {
    const q = 'INSERT INTO calculation(`Port_Status`) VALUES(?)';
    const values = [
        req.body.Port_Status,
    ];
    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/distance', (req, res) => {
    const { lpname, dpname } = req.query;
    const q = "SELECT DistanceValue FROM ports WHERE(fromport=? AND Toport=?) OR(fromport=? AND Toport=?)";
    db.query(q, [lpname, dpname, dpname, lpname], (err, results) => {
        if (err) {
            return res.status(500).json({ Distance: err.message });
        }
        if (results.length > 0) {
            res.status(200).json({ Distance: results[0].DistanceValue });
        } else {
            res.status(404).json({ Distance: "Distance Not Found" });
        }
    });
});

app.get('/charterer', (req, res) => {
    const query = 'SELECT * FROM charterers';
    db.query(query, (err, data) => {
        if (err) return res.status(500).json({ message: 'Cannot access the DB', error: err });
        return res.json(data);
    });
});

// راه‌اندازی سرور
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`connected to server 2024 on port ${PORT}`);
});