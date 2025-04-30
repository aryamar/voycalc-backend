import express from 'express'
import mysql from 'mysql'
import cors from 'cors'

//const port = 5000
const app = express();
app.use(express.json())
app.use(cors())

app.listen(5000, () => {
    console.log('connected to server 2024')
});

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to voycalc-backend!' });
  });
  
  // مسیر تست (که قبلاً داشتی)
  app.get('/api/test', (req, res) => {
    res.json({ message: 'Hello from backend!' });
  });

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'voyage_estimate'
})


app.get('/calculation', (req, res) => {
    const query = 'SELECT * FROM calculation'
    db.query(query, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    });
})

app.get('/vsltype', (req, res) => {
    const q = "SELECT Vessel_Type FROM vesseltype"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.post('/calc', (req, res) => {
    const query = "INSERT INTO calculation (`Vessel_Name`,`Deadweight`,`Cargo_quantity`,`Vessel_Type`,`Distance`,`IFO_Qtty`,`MDO_Qtty`,`IFOAtSea`,`MDOAtSea`,`IFOAtPort`,`MDOAtPort`,`Speed_Ballast`,`IFO_Price`,`MDO_Price`,`TTL_Fuel_Price`,`PortDays`,`Steam_Days`,`Commission`,`LoadPort`,`DischargePort`,`LportDays`,`DportDays`,`LoadRate`,`DischargeRate`,`StandingCost`, `BreakEven`,`TTLDays`,`OtherExpences`,`DailyHire`,`VoyageNumber`,`min_plus_1`,`Charterer`,`LPortCost`,`DPortCost`,`AddPortDays`,`AddSteamDays`,`Commodity`,`TotalCost`,`LoadTerm`,`DischargeTerm`,`Ttl_Commission`,`Ttl_Do_Price`,`Ttl_Fo_Price`,`Speed_Laden`,`Ballast_Days`,`Laden_Days`,`Port_Status`) VALUES(?)";
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


    ]

    db.query(query, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.post('/login', (req, res) => {
    const q = "INSERT INTO login(`username`,`email`,`password`) VALUES(?)"
    const values = [
        req.body.username,
        req.body.email,
        req.body.password,
    ]
    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})
app.get('/signup', (req, res) => {
    const qry = "SELECT * FROM login"
    db.query(qry, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.get('/vsllist', (req, res) => {
    const q = 'SELECT Vessel_Name FROM calculation'
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.get('/portstatus', (req, res) => {
    const q = "SELECT * FROM portstatus"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.get('/commodity', (req, res) => {
    const query = 'SELECT * FROM commodity'
    db.query(query, (error, data) => {
        if (error) return res.json(error)
        return res.json(data)
    })
})
app.post("/portstate", (req, res) => {
    const q = 'INSERT INTO calculation(`Port_Status`)VALUES(?)'
    const values = [
        req.body.Port_Status,
    ]
    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

// app.get('/ports',(req,res)=>{
//     const query=req.query.q;
//     const q='SELECT fromport FROM ports WHERE fromport LIKE? limit 1'
//     db.query(q,[`%${query}%`],(err,data)=>{
//         if(err)return res.json(err)
            
//         const suggestions = data.map((row) => row.fromport);
//         res.send(suggestions);
//     })
// })

app.get('/ports', (req, res) => {
    const q = "SELECT * FROM ports"
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ message: err.message })
        return res.json(data)
    })
})


app.get('/distance', (req, res) => {
    const { lpname, dpname } = req.query;
    const q = "SELECT DistanceValue FROM ports WHERE(fromport=? AND Toport=?) OR(fromport=? AND Toport=?)"
    db.query(q, [lpname, dpname, dpname, lpname], (err, results) => {

        if (err) {
            return res.status(500).json({ Distance: err.message })
        }
        if (results.length > 0) {
            res.status(200).json({ Distance: results[0].DistanceValue })
        } else {
            res.status(404).json({ Distance: "Distance Not Found" })

        }
    })
});

app.get('/charterer', (req, res) => {

    const query ='SELECT * FROM charterers'
    db.query(query, (data, err) => {
        if (err) return res.json(err)
         return res.status(500). json( 'Can not Access to the DB.',err )
    })
}) 
