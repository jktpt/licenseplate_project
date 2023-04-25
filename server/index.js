// const express = require('express')
// const app = express()
const fs = require("fs");
const mysql = require("mysql");
// const cors = require('cors')
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
const secret = "license-login-project";
var jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");
// const sql = require('mssql');
const saltRounds = 10;

const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// New db
const db = mysql.createConnection({
  host: "parking2-mysql.mysql.database.azure.com",
  user: "thitaporn",
  password: "!qazxsw23edC",
  database: "parking2-sql",
  connectionLimit: 10,
  port: 3306,
  ssl: {
    // ca: fs.readFileSync("D:\DigiCertGlobalRootCA.crt")
  },
});

db.connect((err) => {
  if (err) throw err.message;
  console.log("Connected!");
});

app.post("/api/register", jsonParser, (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.fname;
  const surname = req.body.lname;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    db.query(
      "INSERT INTO users (username,password,name,surname,email) VALUES(?,?,?,?,?)",
      [username, hash, name, surname, email],
      (err, result) => {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        res.json({ status: "ok" });
      }
    );
  });
});

app.post("/api/login", jsonParser, (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    db.query(
      "SELECT * FROM users WHERE username=?",
      [username],
      (err, users, result) => {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        if (users.length == 0) {
          res.json({ status: "error", message: "no user found" });
          return;
        }

        bcrypt.compare(password, users[0].password, function (err, isLogin) {
          if (isLogin) {
            var token = jwt.sign({ username: users[0].username }, secret, {
              expiresIn: "1h",
            });
            res.json({ status: "ok", message: "login success", token });
          } else {
            console.log();
            res.json({ status: "error", message: result });
          }
        });
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/authen", jsonParser, (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, secret);
    res.json({ status: "ok", decoded });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

app.put("/api/getrole", (req, res) => {
  const user = req.body.roleDB;
  try {
    db.query(
      "SELECT username,role FROM users WHERE username=?",
      [user],
      (err, result) => {
        err ? console.log(err) : res.send(result[0]);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.put("/api/getfivescroll", (req, res) => {
  const plate = req.body.plate;
  db.query(
    "SELECT * FROM `licenseplate` WHERE plate=? ORDER BY id DESC LIMIT 3 OFFSET 1;",
    [plate],
    (err, result) => {
      err ? console.log(err) : res.send(result);
    }
  );
});

app.get("/api/alluser", (req, res) => {
  db.query(
    "SELECT user_id,username,name,surname,email,role FROM users",
    (err, result) => {
      err ? console.log(err) : res.send(result);
    }
  );
});

app.put("/api/updaterole", (req, res) => {
  const role = req.body.role;
  const id = req.body.id;
  try {
    db.query(
      "UPDATE `users` SET `role`=? WHERE user_id=?;",
      [role, id],
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/checkhistory", (req, res) => {
  const plate = req.body.plate;
  // console.log('this is plate '+plate)
  try {
    db.query(
      "SELECT *,CASE WHEN timeout IS NOT NULL THEN 'OP' ELSE 'P'END AS status,COALESCE(TIMESTAMPDIFF(hour, timein, timeout),'-') AS 'totaltimein',COALESCE(TIMESTAMPDIFF(hour, timein, timeout),'-')*10 AS 'totalprice' FROM licenseplate WHERE plate=? ORDER BY id DESC LIMIT 2;",
      [plate],
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/licenseplate", (req, res) => {
  try {
    db.query(
      "SELECT id,plate,membertype,DATE_FORMAT(timein, '%d %M %Y %H:%i') as timein,DATE_FORMAT(timeout, '%d %M %Y %H:%i') as timeout,CASE WHEN timeout IS NOT NULL THEN 'Out of parking' ELSE 'Parking'END AS status from licenseplate;",
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/getlicensecar", (req, res) => {
  try {
    db.query(
      "SELECT *,DATE_FORMAT(timein, '%d %M %Y %H:%i') as timein,COALESCE(DATE_FORMAT(timeout, '%d %M %Y %H:%i'),'-') as timeout,CASE WHEN timeout IS NOT NULL THEN 'Out of parking' ELSE 'Parking'END AS status,COALESCE(TIMESTAMPDIFF(hour, timein, timeout),'-') AS 'totaltimein',COALESCE(TIMESTAMPDIFF(hour, timein, timeout),'-')*10 AS 'totalprice' from licenseplate;",
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/recently", (req, res) => {
  try {
    db.query(
      "SELECT *,CASE WHEN timeout IS NOT NULL THEN 'OP' ELSE 'P'END AS status,COALESCE(TIMESTAMPDIFF(hour, timein, timeout),'-') AS 'totaltimein',COALESCE(TIMESTAMPDIFF(hour, timein, timeout),'-')*10 AS 'totalprice' FROM licenseplate ORDER BY id DESC LIMIT 4;",
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/totalcar", (req, res) => {
  try {
    db.query(
      // "SELECT COUNT(plate) as numberOfPlate FROM licenseplate",
      `SELECT
      COUNT(*) AS total_plate
  FROM
      licenseplate
  WHERE
      timein BETWEEN DATE_FORMAT(CURRENT_DATE - INTERVAL 1 MONTH, '%Y-%m-01') AND LAST_DAY(CURRENT_DATE);
  `,
      
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/lastmonthcar", (req, res) => {
  try {
    db.query(
      // "SELECT COUNT(plate) as numberOfPlate FROM licenseplate",
      `SELECT COUNT(*) AS total_plate_last_month FROM licenseplate WHERE YEAR(timein) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH) AND MONTH(timein) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH);`,
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/currentmonthcar", (req, res) => {
  try {
    db.query(
      // "SELECT COUNT(plate) as numberOfPlate FROM licenseplate",
      `SELECT COUNT(*) AS total_plate_current_month FROM licenseplate WHERE YEAR(timein) = YEAR(CURRENT_DATE) AND MONTH(timein) = MONTH(CURRENT_DATE);`,
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/sameplate", (req, res) => {
  try {
    db.query(
      "select* from licenseplate group by plate having COUNT(plate) > 1",
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/todaycar", (req, res) => {
  try {
    db.query(
      "select COUNT(plate) as todayCar from licenseplate where date(timein) = CURDATE()",
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/parkingcar", (req, res) => {
  try {
    db.query(
      "select COUNT(*) as todayparking from licenseplate where date(timein) = CURDATE() AND date(timeout) IS NULL",
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/outofcar", (req, res) => {
  try {
    db.query(
      "select COUNT(*) as outofcar from licenseplate where date(timein) = CURDATE() AND date(timeout) IS NOT NULL",
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/samedata", (req, res) => {
  try {
    db.query(
      "select * from licenseplate where plate in ( select plate from licenseplate group by plate having count(*) > 1)",
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/timestampdiff", (req, res) => {
  try {
    db.query(
      "SELECT SUM(TIMESTAMPDIFF(hour, timein, timeout)) AS 'Hours' FROM licenseplate WHERE date(timein) = CURDATE()",
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/day1to7", (req, res) => {
  try {
    db.query(
      "SELECT COALESCE(SUM(CASE WHEN DATE(timein) BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND DATE_FORMAT(NOW(), '%Y-%m-07') THEN TIMESTAMPDIFF(HOUR, timein, timeout) * 10 ELSE 0 END), 0) AS current_month,COALESCE(SUM(CASE WHEN DATE(timein) BETWEEN DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-01') AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-07') THEN TIMESTAMPDIFF(HOUR, timein, timeout) * 10 ELSE 0 END), 0) AS prev_month FROM licenseplate",
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/day8to15", (req, res) => {
  try {
    db.query(
      "SELECT COALESCE(SUM(CASE WHEN DATE(timein) BETWEEN DATE_FORMAT(NOW(), '%Y-%m-08') AND DATE_FORMAT(NOW(), '%Y-%m-15') THEN TIMESTAMPDIFF(HOUR, timein, timeout) * 10 ELSE 0 END), 0) AS current_month,COALESCE(SUM(CASE WHEN DATE(timein) BETWEEN DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-08') AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-15') THEN TIMESTAMPDIFF(HOUR, timein, timeout) * 10 ELSE 0 END), 0) AS prev_month FROM licenseplate",
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/day16to23", (req, res) => {
  try {
    db.query(
      "SELECT COALESCE(SUM(CASE WHEN DATE(timein) BETWEEN DATE_FORMAT(NOW(), '%Y-%m-16') AND LAST_DAY(NOW()) AND DAY(timein) < 24 THEN TIMESTAMPDIFF(HOUR, timein, timeout) * 10 ELSE 0 END), 0) AS current_month,COALESCE(SUM(CASE WHEN DATE(timein) BETWEEN DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-16') AND LAST_DAY(DATE_SUB(NOW(), INTERVAL 1 MONTH)) AND DAY(timein) < 24 THEN TIMESTAMPDIFF(HOUR, timein, timeout) * 10 ELSE 0 END), 0) AS prev_month FROM licenseplate",
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/day24to31", (req, res) => {
  try {
    db.query(
      "SELECT COALESCE(SUM(CASE WHEN DATE(timein) BETWEEN DATE_FORMAT(NOW(), '%Y-%m-24') AND LAST_DAY(NOW()) THEN TIMESTAMPDIFF(HOUR, timein, timeout) * 10 ELSE 0 END), 0) AS current_month,COALESCE(SUM(CASE WHEN DATE(timein) BETWEEN DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-24') AND LAST_DAY(DATE_SUB(NOW(), INTERVAL 1 MONTH)) THEN TIMESTAMPDIFF(HOUR, timein, timeout) * 10 ELSE 0 END), 0) AS prev_month FROM licenseplate",
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.put("/api/updatelicense", (req, res) => {
  const id = req.body.id;
  //console.log("ID FROM BACK"+id);
  try {
    db.query(
      "UPDATE licenseplate SET timeout = now() WHERE id=?",
      [id],
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.put("/api/updatelicensecar", (req, res) => {
  const id = req.body.id;
  const plate = req.body.plate;
  //console.log("ID FROM BACK"+id);
  try {
    db.query(
      "UPDATE licenseplate SET plate =? WHERE id=?",
      [plate, id],
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.delete("/api/delete/:id", (req, res) => {
  const id = req.params.id;
  try {
    db.query("DELETE FROM licenseplate WHERE id = ?", id, (err, result) => {
      err ? console.log(err) : res.send(result);
    });
  } catch (err) {
    console.log(err);
  }
});

app.delete("/api/deleteuser/:id", (req, res) => {
  const id = req.params.id;
  try {
    db.query("DELETE FROM users WHERE user_id = ?", id, (err, result) => {
      err ? console.log(err) : res.send(result);
    });
  } catch (err) {
    console.log(err);
  }
});

// Slot call API
app.get(`/api/slot`, (req, res) => {
  // db.query("SELECT slot_id,slot,status_slot,licenseplate.plate from slot LEFT JOIN licenseplate ON licenseplate.id = slot.plate_id;",(err,result)=>{
  //     err ? console.log(err) : res.send(result)
  // })
  try {
    db.query(
      `SELECT slot_id, slot, status_slot, 
      CASE WHEN DATE_FORMAT(licenseplate.timein, '%d %M %Y %H:%i') is not null 
        THEN DATE_FORMAT(licenseplate.timein, '%d %M %Y %H:%i') 
        ELSE '-' 
      END as timein,
      CASE WHEN plate is not null 
        THEN licenseplate.plate 
        ELSE '-' 
      END as plate, 
      CASE WHEN slot.vip_plate is not null 
        THEN slot.vip_plate 
        ELSE '-' 
      END as vip_plate 
    FROM slot 
    LEFT JOIN licenseplate ON licenseplate.id = slot.plate_id 
    ORDER BY slot_id ASC;`,
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.put("/api/vipslots", (req, res) => {
  const slot = req.body.slots;
  const plate = req.body.plate;
  // console.log(req.body.plate)
  try {
    db.query(
      "UPDATE `slot` SET `status_slot`='Lock' ,vip_plate = ? WHERE slot_id = ?",
      [plate, slot],
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.put("/api/lockslots", (req, res) => {
  const slot = req.body.slots;
  // console.log(req.body.plateAPI)
  try {
    db.query(
      "UPDATE `slot` SET `status_slot`='Lock' WHERE slot = ?",
      [slot],
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.put("/api/unlockslots", (req, res) => {
  const slot = req.body.slots;
  // console.log(req.body.plateAPI)
  try {
    db.query(
      "UPDATE `slot` SET `status_slot`='Available',vip_plate=NULL WHERE slot = ?",
      [slot],
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.put("/api/checkinslot", (req, res) => {
  const slot = req.body.slot;
  // console.log(slot)
  const plateAPI = req.body.plateAPI;
  // console.log(req.body.plateAPI)
  try {
    db.query(
      "UPDATE `slot` SET `status_slot`='Unavailable',plate_id = ? WHERE slot = ?;",
      [plateAPI, slot],
      (err, result) => {
        // err ? console.log(err) : res.send(result);
      }
    );
    db.query(
      "UPDATE licenseplate SET timein=now(),latest_slot=? WHERE id=?",
      [slot, plateAPI],
      (err, result) => {
        // err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.put("/api/checkoutslot", (req, res) => {
  const slot = req.body.slot;
  const plateAPI = req.body.plateAPI;
  try {
    db.query(
      "UPDATE `slot` SET `status_slot`='Available',`plate_id`= NULL ,vip_plate=NULL WHERE slot = ?;",
      [slot],
      (err, result) => {
        // err ? console.log(err) : res.send(result);
      }
    );
    db.query(
      "UPDATE licenseplate SET timeout=now() WHERE id=?",
      [plateAPI, plateAPI],
      (err, result) => {
        // err ? console.log(err) : res.send(result);
      }
    );
    // db.query("UPDATE licenseplate SET rates = (SELECT COALESCE(TIMESTAMPDIFF(hour, timein, timeout),'-')*10 AS 'totalprice' FROM licenseplate WHERE id=?) WHERE id=?",[plateAPI,plateAPI],(err,result)=>{
    //     // err ? console.log(err) : res.send(result);
    // })
    db.query(
      "UPDATE licenseplate SET rates = ( SELECT COALESCE(TIMESTAMPDIFF(hour, timein, timeout),'-')*10 AS 'totalprice' FROM (SELECT * FROM licenseplate WHERE id=?) AS lp) WHERE id=?;",
      [plateAPI, plateAPI],
      (err, result) => {
        // err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.put("/api/getlatest", (req, res) => {
  // console.log(req.body.plate);
  const plate = req.body.plate;
  try {
    db.query(
      "SELECT * FROM licenseplate WHERE plate=? ORDER BY id DESC LIMIT 1;",
      [plate],
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/getplatedatalatest", (req, res) => {
  try {
    db.query(
      "SELECT `id`, `plate`, `timein`, `timeout`, `latest_slot`, `pl_image`, `rates` FROM `licenseplate` ORDER BY plate DESC,id DESC;",
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.put("/api/getbill", (req, res) => {
  // console.log(req.body.plate);
  const plate = req.body.plate;
  try {
    db.query(
      "SELECT *,COALESCE(TIMESTAMPDIFF(hour, timein, timeout),'-') AS 'hours' FROM licenseplate WHERE plate=? ORDER BY id DESC LIMIT 1;",
      [plate],
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/guardhouse", (req, res) => {
  try {
    db.query(
      "SELECT *, GREATEST(COALESCE(timein, '1000-01-01'), COALESCE(timeout, '1000-01-01')) AS latest_time FROM licenseplate ORDER BY latest_time DESC LIMIT 4;",
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/guardhousefor1", (req, res) => {
  try {
    db.query(
      "SELECT *, GREATEST(COALESCE(timein, '1000-01-01'), COALESCE(timeout, '1000-01-01')) AS latest_time FROM licenseplate ORDER BY latest_time DESC LIMIT 1;",
      (err, result) => {
        err ? console.log(err) : res.send(result);
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.listen("3001", () => {
  console.log("server is running on port 3001");
});
