
// Old db
// const config = {
//     user: 'thitaporn1234',
//     password: 'Thitaporn!',
//     server: 'licenseplate2.database.windows.net',
//     database: 'parking2',
//     options: {
//         encrypt: true // For Azure SQL Database, you need encryption on by default
//     }
// };

// const pool = new sql.ConnectionPool(config);

// Check connection
// pool.connect(err => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     console.log('Connected to Azure SQL Database!');

// });


// test get method
app.get('/testallslot',async (req,res)=>{
    try{
      await pool.connect();
      const result = await pool.query('SELECT * FROM slot');
      result ? res.send(result.recordsets[0]) : console.log(err);
    }catch (err){
      console.log(err);
    }
  })

  
// Register api
// app.post('/api/register', jsonParser, async (req, res, next) => {
//       const email = req.body.email;
//       const username = req.body.username;
//       const password = req.body.password;
//       const name = req.body.fname;
//       const surname = req.body.lname;
//       const hash = await bcrypt.hash(password, saltRounds);
      
//     //   const query = `INSERT INTO users (username, password, name, surname, email, role) VALUES (@username,@hash,@name,@surname,@email, 'user')`;
//     //   const params = [username,hash,name,surname,email];
//     //   pool.query(query,{prepare:true});
//     //   console.log(hash);
//     //   await pool.connect();
//     //   await pool.query("INSERT INTO users (username,password,name,surname,email,role) VALUES($6,$7,$8,$9,$10,'user')",[username,hash,name,surname,email], (err, result) => {
//       pool.query(`INSERT INTO users (username, password, name, surname, email, role) VALUES ('${username}', '${hash}', '${name}', '${surname}', '${email}', 'user')`,(err,result)=>{
//         if(err){
//             res.json({status:"error",message:err})
//               return
//         }
//         res.json({status:'ok'})
//       })
//     } 
//   );

// Login api
// app.post('/api/login',jsonParser,async (req,res)=>{
//     try{
//         const username = req.body.username
//         const password = req.body.password
//         pool.query(`SELECT * FROM users WHERE username='${username}'`, (err,users,result)=>{
//             if(err){ res.json({status:"error",message:err}); return}
//             if(users.length == 0){res.json({status:'error',message:'no user found'});return }
//             // console.log(users.recordset[0]);
//             bcrypt.compare(password, users.recordset[0].password, function(err, isLogin) {
//               if(isLogin){
//                     var token = jwt.sign({ username: users.recordset[0].username }, secret,{expiresIn:'1h'});
//                     res.json({status:"ok",message:"login success",token})
//               }else{
//                     console.log()
//                      res.json({status:"error",message:result})
//               }
//          });
//      })
//     }catch (err){
//         console.log(err);
//     }
// })

// authentication api
// app.post('/api/authen',jsonParser,(req,res)=>{
//     try{
//       const token = req.headers.authorization.split(' ')[1]
//       var decoded = jwt.verify(token,secret)
//       res.json({status:'ok',decoded})
//     }catch(err){
//       res.json({status:'error',message:err.message})
//     }
//   })

//   get role in sidebar to make a role in web application
app.put('/api/getrole',(req,res)=>{
    try{
     const user = req.body.roleDB;
     pool.query(`SELECT username,role FROM users WHERE username='${user}'`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset[0]);
     })
    }catch(err){
     res.json({status:'error',message:err.message})
    }
 })
 
 //  #########################################
 // Home API
 // It's use for guardhouse page / homepage in recently cars and history of recently cars
 app.get('/api/guardhouse',(req,res)=>{
    try{
      pool.query(`SELECT TOP 4 *, 
                   IIF(ISNULL(timein, '1000-01-01') > ISNULL(timeout, '1000-01-01'), 
                   timein, 
                   timeout) AS latest_time 
                 FROM licenseplate 
                 ORDER BY latest_time DESC`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset);
     })
    }catch(err){
     res.json({status:'error',message:err.message})
    }
 })
 
 
 // History table
 app.post('/api/checkhistory',(req,res)=>{
     const plate = req.body.plate
     // console.log('this is plate '+plate)
     pool.query(`SELECT TOP 2 *, 
                     CASE WHEN timeout IS NOT NULL THEN 'OP' ELSE 'P' END AS status,
                     COALESCE(DATEDIFF(hour, timein, timeout), '-') AS 'totaltimein',
                     COALESCE(DATEDIFF(hour, timein, timeout), '-') * 10 AS 'totalprice'
                 FROM licenseplate 
                 WHERE plate = N'${plate}'
                 ORDER BY id DESC`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset)
     })
   })
 
 //   plate latest
 app.get('/api/getplatedatalatest',(req,res)=>{
     pool.query(`SELECT id, plate, timein, timeout, latest_slot, pl_image, rates FROM licenseplate ORDER BY plate DESC,id DESC`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset);
     })
 })
 
 
 //   ##### four block right home page
 
 // home totalcar 
 app.get('/api/totalcar',(req,res)=>{
     pool.query(`SELECT COUNT(plate) as numberOfPlate FROM licenseplate`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset)
     })
 })
 
 // today car
 app.get('/api/todaycar',(req,res)=>{
     pool.query(`SELECT COUNT(plate) as todayCar 
                 FROM licenseplate 
                 WHERE CAST(timein AS DATE) = CAST(GETDATE() AS DATE)`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset)
     })
 })
 
 // parking car
 app.get('/api/parkingcar',(req,res)=>{
     pool.query(`SELECT COUNT(*) as todayparking 
                 FROM licenseplate 
                 WHERE CAST(timein AS DATE) = CAST(GETDATE() AS DATE) 
                 AND CAST(timeout AS DATE) IS NULL`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset)
     })
 })
 
 // out of car
 app.get('/api/outofcar',(req,res)=>{
     pool.query(`SELECT COUNT(*) as outofcar 
                 FROM licenseplate 
                 WHERE CAST(timein AS DATE) = CAST(GETDATE() AS DATE) 
                 AND CAST(timeout AS DATE) IS NOT NULL`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset)
     })
 })
 
 // ###################
 
 // timestamp diff
 app.get('/api/timestampdiff',(req,res)=>{
     pool.query(`SELECT SUM(DATEDIFF(hour, timein, timeout)) AS 'Hours' 
                 FROM licenseplate
                 WHERE CAST(timein AS DATE) = CAST(GETDATE() AS DATE)`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset)
     })
 })
 
 // ############ Revenue graph home page
 app.get('/api/day1to7',(req,res)=>{
     pool.query(`SELECT 
                     COALESCE(
                         SUM(
                                 CASE WHEN CAST(timein AS DATE) BETWEEN CAST(DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0) AS DATE) AND CAST(DATEADD(DAY, -1, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) + 1, 0)) AS DATE) 
                                 THEN DATEDIFF(hour, timein, timeout) * 10 ELSE 0 END
                         ), 
                         0
                     ) AS current_month,
                     COALESCE(
                         SUM(
                             CASE WHEN CAST(timein AS DATE) BETWEEN CAST(DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) - 1, 0) AS DATE) AND CAST(DATEADD(DAY, -1, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0)) AS DATE)
                             THEN DATEDIFF(hour, timein, timeout) * 10 ELSE 0 END
                         ), 
                         0
                     ) AS prev_month 
                 FROM licenseplate`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset);
     })
 })
 
 app.get('/api/day8to15',(req,res)=>{
     pool.query(`SELECT 
                     COALESCE(
                         SUM(
                             CASE WHEN CAST(timein AS DATE) BETWEEN CAST(DATEADD(DAY, 7, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0)) AS DATE) AND CAST(DATEADD(DAY, -1, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) + 1, 0)) AS DATE)
                             THEN DATEDIFF(hour, timein, timeout) * 10 ELSE 0 END
                         ), 
                         0
                     ) AS current_month,
                     COALESCE(
                         SUM(
                             CASE WHEN CAST(timein AS DATE) BETWEEN CAST(DATEADD(DAY, 7, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) - 1, 0)) AS DATE) AND CAST(DATEADD(DAY, -1, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0)) AS DATE)
                             THEN DATEDIFF(hour, timein, timeout) * 10 ELSE 0 END
                         ), 
                         0
                     ) AS prev_month 
                 FROM licenseplate`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset);
     })
 })
 
 app.get('/api/day16to23',(req,res)=>{
     pool.query(`SELECT 
                     COALESCE(
                         SUM(
                             CASE WHEN CAST(timein AS DATE) BETWEEN CAST(DATEADD(DAY, 16, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0)) AS DATE) AND CAST(EOMONTH(GETDATE()) AS DATE) AND DAY(timein) < 24
                             THEN DATEDIFF(hour, timein, timeout) * 10 ELSE 0 END
                         ), 
                         0
                     ) AS current_month,
                     COALESCE(
                         SUM(
                             CASE WHEN CAST(timein AS DATE) BETWEEN CAST(DATEADD(DAY, 16, DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) - 1, 0)) AS DATE) AND CAST(EOMONTH(DATEADD(MONTH, -1, GETDATE())) AS DATE) AND DAY(timein) < 24
                             THEN DATEDIFF(hour, timein, timeout) * 10 ELSE 0 END
                         ), 
                         0
                     ) AS prev_month 
                 FROM licenseplate`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset);
     })
 })
 
 app.get('/api/day24to31',(req,res)=>{
     pool.query(`SELECT 
                     COALESCE(SUM(CASE WHEN DATEPART(day, timein) BETWEEN 24 AND 31 THEN DATEDIFF(hour, timein, timeout) * 10 ELSE 0 END), 0) AS current_month,
                     COALESCE(SUM(CASE WHEN DATEPART(day, timein) BETWEEN 24 AND 31 THEN DATEDIFF(hour, timein, timeout) * 10 ELSE 0 END), 0) AS prev_month
                 FROM licenseplate
                 WHERE MONTH(timein) = MONTH(GETDATE()) OR MONTH(timein) = MONTH(DATEADD(month, -1, GETDATE()))`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset);
     })
 })
 
 
 // ##########################################
 // Edit data components
 app.get('/api/getlicensecar',(req,res)=>{
    try{
     pool.query(`SELECT 
                     *,
                     CONVERT(NVARCHAR(20), timein, 106) + ' ' + CONVERT(NVARCHAR(20), timein, 108) as timein,
                     COALESCE(CONVERT(NVARCHAR(20), timeout, 106) + ' ' + CONVERT(NVARCHAR(20), timeout, 108),'-') as timeout,
                     CASE 
                       WHEN timeout IS NOT NULL THEN 'Out of parking' 
                       ELSE 'Parking' 
                     END AS status,
                     COALESCE(DATEDIFF(HOUR, timein, timeout),'-') AS 'totaltimein',
                     COALESCE(DATEDIFF(HOUR, timein, timeout),'-') * 10 AS 'totalprice'
                 FROM licenseplate`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset)
     })
    }catch(err){
     res.json({status:'error',message:err.message})
    }
 })
 
 app.put('/api/updatelicensecar',(req,res)=>{
    try{
     const id = req.body.id;
     const plate = req.body.plate;
     pool.query(`UPDATE licenseplate SET plate =N'${plate}' WHERE id='${id}'`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset)
     })
    }catch(err){
     res.json({status:'error',message:err.message})
    }
 })
 
 
 app.delete('/api/delete/:id',(req,res)=>{
   try{
     const id = req.params.id;
     db.query(`DELETE FROM licenseplate WHERE id = ${id}`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset)
     })
   }catch(err){
     res.json({status:'error',message:err.message})
   }
 })
 
 app.put('/api/getfivescroll',(req,res)=>{
     const plate = req.body.plate;
     pool.query(`SELECT *
     FROM (
        SELECT *, ROW_NUMBER() OVER (ORDER BY id DESC) AS RowNum 
        FROM licenseplate 
        WHERE plate = N'${plate}'
     ) AS T
     WHERE T.RowNum BETWEEN 2 AND 4`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset);
     })
 })
 
 // ##########################
 // Slot management
 
 app.get('/api/alluser',(req,res)=>{
     pool.query(`SELECT user_id,username,name,surname,email,role FROM users`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset);
     })
 })
 
 app.delete('/api/deleteuser/:id',(req,res)=>{
     const id = req.params.id;
     pool.query(`DELETE FROM users WHERE user_id = '${id}'`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset)
     })
 })
 
 app.put('/api/updaterole',(req,res)=>{
     const role = req.body.role
     const id = req.body.id
     // console.log('this is plate '+plate)
     pool.query(`UPDATE users SET role='${role}' WHERE user_id='${id}'`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset)
     })
 })
 
 
 // ##################SLOT PAGE
 // slot
 app.get(`/api/slot`,(req,res)=>{
     pool.query(`SELECT slot.slot_id, slot.slot, slot.status_slot,
                     CASE WHEN FORMAT(licenseplate.timein, 'dd MMM yyyy HH:mm') IS NOT NULL
                     THEN FORMAT(licenseplate.timein, 'dd MMM yyyy HH:mm')
                     ELSE '-' END AS timein,
                     CASE WHEN plate IS NOT NULL THEN licenseplate.plate ELSE '-' END AS plate,
                     CASE WHEN slot.vip_plate IS NOT NULL THEN slot.vip_plate ELSE '-' END AS vip_plate
                 FROM slot
                 LEFT JOIN licenseplate ON licenseplate.id = slot.plate_id`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset)
     })
 })
 
 //  Lock slot
 app.put('/api/lockslots',(req,res)=>{
     const slot = req.body.slots;
     // console.log(req.body.plateAPI)
     pool.query(`UPDATE slot SET status_slot='Lock' WHERE slot = '${slot}'`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset);
     })
 })
 
 // Unlock slot
 app.put('/api/unlockslots',(req,res)=>{
     const slot = req.body.slots;
     // console.log(req.body.plateAPI)
     pool.query(`UPDATE slot SET status_slot='Available',vip_plate=NULL WHERE slot = '${slot}'`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset);
     })
 })
 
 app.put('/api/vipslots',(req,res)=>{
     const slot = req.body.slots;
     const plate = req.body.plate;
 
     pool.query(`UPDATE slot SET status_slot='Lock' ,vip_plate = N'${plate}' WHERE slot_id = '${slot}'`,(err,result)=>{
         err ? console.log(err) : res.send(result.recordset);
     })
 })