import Express from "express";
import cors from "cors";
import mysql from "mysql";
const app = Express();
app.use(Express.json()); // to support JSON-encoded bodies
app.use(Express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(cors());
app.listen(1010, () => {
  console.log(`Example app listening at http://localhost:${1010}`);
});
let connection = "";
function handleDisconnect() {
  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "GUZOWAY",
  });
  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}
handleDisconnect();
app.post("/passanger/login", (req, res) => {
  console.log("/passanger/login");
  let sql = `select * from  PassangersTabel where (Email='${req.body.phoneOrEmail}' or phoneNumber='${req.body.phoneOrEmail}')`;
  connection.query(sql, (err, result) => {
    if (err) console.log(err);
    console.log(result);
    res.json(result);
  });
});
app.get("/", (req, res) => {
  console.log(res);
  res.end(`<h1>
  <a href='index.html'>Log in as driver</a> <br/>
  <a href='index.html'>Log in as driver</a>
  </h1>`);
});

app.post("/register/passangers", (req, res) => {
  // Create a connection to the database
  // console.log(req.body);

  // open the MySQL connection
  // connection.connect((error) => { });
  var sql =
    "CREATE TABLE if not exists PassangersTabel (ID int NOT NULL AUTO_INCREMENT,FullName VARCHAR(255),PhoneNumber VARCHAR(255),Email VARCHAR(255),PRIMARY KEY (ID))";
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
    //   res.end("connected");
  });
  let insertToPassangers = `insert into PassangersTabel(FullName,PhoneNumber,Email)values('${req.body.fullName}','${req.body.phoneNumber}','${req.body.emaillAdress}')`;
  connection.query(insertToPassangers, function (err, result) {
    if (err) throw err;
    console.log("Table created");
    res.end(
      "<h1> you are registered well. <a href='http://127.0.0.1:5500/index.html#banner-section'>click here</a> to go to your home page. Thank you. </h1>"
    );
  });
});
app.post("/drivers/register", (req, res) => {
  console.log(
    req.body.driversFullName,
    req.body.driversLiscenceNumber,
    req.body.driverPlateNumber
  );
  let sql = `create table if not exists driversTable(driversId int auto_increment,
  driversName varchar(255),
  driversPhoneNumber varchar(40),
  driversLisenceNumber varchar(255),plateNumber varchar(255),
  PRIMARY KEY (driversId))`;
  let insertDriversInfo = `insert into driversTable (driversName, driversLisenceNumber, plateNumber,driversPhoneNumber) values('${req.body.driversFullName}','${req.body.driversLiscenceNumber}','${req.body.driverPlateNumber}','${req.body.driversPhoneNumber}')`;

  // open the MySQL connection
  // connection.connect((error) => { });
  if (error) {
    console.log("A error has been occurred " + "while connecting to database.");
    throw error;
  }
  connection.query(sql, (err, result) => {
    if (err) console.log(err);
    if (result) console.log("Drivers data  created well");

    res.json({ driversFullName: req.body.driversFullName });
  });
  connection.query(insertDriversInfo, (err, result) => {
    if (err) throw err;
    if (result) console.log("drivers data inserted well data inserted ");
  });
});
///////////////////////////////////////////////
app.post("/getOnlineDrivers", (req, res) => {
  let passangersId = req.body.passangersId;
  let sql = `create table if not exists onlineDrivers(onlineId int auto_increment,driversId varchar(255),
    Status varchar(255),passangersId varchar(255),driversLocation varchar(255),passangersLocation varchar(255),passangersDestination varchar(255),passangersRequestTime varchar(255),
    passangersDestinationTime varchar(255),primary key (onlineId))`;
  connection.query(sql, (err, result) => {
    if (err) console.log(err);
    else console.log(result);
    console.log("table online is created well ");
  });
  // it is ok
  // -check if i have already requested
  let checkIfIHaveRequested = `select * from onlineDrivers where passangersId='${passangersId}' and 
    ( Status='answeredToPassangers' )`;
  connection.query(checkIfIHaveRequested, (err, result) => {
    // checkIfIHaveRequested help us to check i have already requested before and to stop from rerequesting
    if (err) {
      console.log(err);
      return;
    }
    if (result.length > 0) {
      res.json(result);
      return;
    } else {
      // get online driver
      let getDrivers = `select * from onlineDrivers join driversTable where onlineDrivers.driversId = 
    driversTable.driversId and Status='active' limit 1 `;
      let requestedOnlineId = 0;
      connection.query(getDrivers, (err, result) => {
        console.log(
          "search result is  " + result,
          "req.body.passangersId = " + req.body.passangersId
        );
        // if there is no driver online
        if (result.length == 0) {
          res.json(result);
          console.log(result.length);
          return;
        } else {
          // if driver is online
          requestedOnlineId = result[0].onlineId;
          let passangersId = req.body.passangersId,
            fromAdress = req.body.fromAdress,
            toAddress = req.body.toAddress;
          let passangersLocation = JSON.stringify(req.body.Location);
          console.log(passangersLocation);
          // return;
          /**
           * 
      fromAdress: fromAdress,
      toAddress: toAddress,
      phoneNumber: phoneNumber,
      selectCraType: selectCraType,
      passangersId: ActivePassangersId,
      Location: { Lat: Lat, Lan: Lan },
           */
          let updateDriversStatus = `update onlineDrivers set Status='requestedByPassangers', 
          passangersId='${passangersId}',passangersLocation='${passangersLocation}' ,
          passangersDestination= '${toAddress}' where onlineId='${requestedOnlineId}'`;
          connection.query(updateDriversStatus, (err, updateResult) => {
            if (err) console.log(err);
            console.log(updateResult);
          });
          res.json(result);
        }
      });
    }
  });

  console.log(req.body.fromAdress);
});

// ////////////////////////////////////////
app.post("/driverLogin", (req, res) => {
  let driversPhone = req.body.driversTelNumber;
  console.log(" req.body = ", req.body.Location);
  // res.end(driversPhone);
  let driversLocation = JSON.stringify(req.body.Location);
  let checkDriver = `select * from driversTable where driversPhoneNumber='${driversPhone}'`;
  let id = 0,
    driversInfo = "";
  let checkIfOnline = "";
  connection.query(checkDriver, (err, restult) => {
    if (err) console.log(err);
    // else res.json(restult);
    console.log(restult);
    // if u are  not registered in guzo wayy driver table,
    //  result.length=0; and send this zero result to client
    if (restult.length == 0) {
      res.json(restult);
      return;
    }
    // if// if u are    registered in guzo wayy driver tabel result.length>0 and the following lines can be executed
    id = restult[0].driversId;
    driversInfo = restult;
    console.log("id is " + id);
    checkIfOnline = `select * from onlineDrivers where (driversId='${id}' and (Status='Active' or
       Status='requestedByPassangers'))`;
    connection.query(checkIfOnline, (err, activeResult) => {
      if (err) console.log(err);
      else {
        if (activeResult.length == 0) {
          insertDriversInfo(id, driversLocation, res);

          // let RegisterInDriver = `insert into onlineDrivers(driversId,Status,driversLocation)values('${id}','Active','${driversLocation}')`;
          // connection.query(RegisterInDriver, (err, result) => {
          //   if (err) {
          //     console.log(err);
          //     return;
          //   } else {
          //     // check agin if online
          //     connection.query(checkIfOnline, (err, activeResult) => {
          //       if (err) {
          //         console.log(err);
          //       } else {
          //         res.json(activeResult);
          //       }
          //     });
          //   }
          // });
          // console.log("no data found here");
        } else {
          res.json(restult);
        }
      }
    });
  });
  // console.log("id is id " + id);
});
app.post("/checkPassangerRequestToDrivers", (req, res) => {
  // console.log( req.body.driverId);
  // return;
  let sql = `select * from onlineDrivers join PassangersTabel where (Status='requestedByPassangers' or Status='answeredToPassangers') and ID=passangersId and driversId='${req.body.driverId}' limit 1`;
  connection.query(sql, (err, result) => {
    // console.log(result, req.body.driverId);
    // if there is no passangers request result.length = 0 ,please search if  driver is on line
    if (result.length == 0) {
      let sql1 = `select * from onlineDrivers where driversId='${req.body.driverId}' and status='Active'`;
      connection.query(sql1, (err, driversResult) => {
        console.log(driversResult);
        if (driversResult.length == 0) {
          let driversLocation = JSON.stringify(req.body.Location);
          console.log(driversLocation);
          insertDriversInfo(req.body.driverId, driversLocation, res);
          return;
        }
        res.json(driversResult);
      });
      return;
    }
    res.json(result);
  });
  // res.json({ driverId: req.body.driverId });
});
app.post("/cancellCallToDriver", (req, res) => {
  let passangersId = req.body.ActivePassangersId;
  let cancelRequest = `update onlineDrivers set Status='canceledByPassangers' where passangersId='${passangersId}' and (Status='answeredToPassangers' or Status='requestedByPassangers')`;
  connection.query(cancelRequest, (err, results) => {
    res.json(results);
  });
});
app.post("/checkDriversDecision", (req, res) => {
  let PassangersId = req.body.ActivePassangersId,
    driversLocation = req.body.Location,
    connectedOnlineId = req.body.connectedOnlineId;
  console.log(PassangersId);
  // res.end("connectedOnlineId " + connectedOnlineId);
  // return;
  if (connectedOnlineId != "noData") {
    // it check connected driver and aim is , if driver reject passangers call, passanger will be informed as driver rejected it
    let checkOnline = `select * from onlineDrivers join driversTable where
    driversTable.driversId = onlineDrivers.driversId and passangersId='${PassangersId}' and
    onlineId = '${connectedOnlineId}'`;
    connection.query(checkOnline, (err, result) => {
      if (err) {
        console.log(err);
        // res.json(err);
      } else {
        if (result.length > 0) {
          res.json(result);
        }
        // else case
      }
    });
    return;
  }
  let getDriversInfo = `select * from onlineDrivers join driversTable where
   driversTable.driversId = onlineDrivers.driversId and passangersId='${PassangersId}' and (Status='requestedByPassangers' or Status='answeredToPassangers' or Status='Active') limit 1`;
  connection.query(getDriversInfo, (err, result) => {
    if (err) console.log(err);
    console.log(result);
    res.json(result);
  });
});
app.post("/driverAnsweredCalls", (req, res) => {
  console.log(req.body.driverId);
  let sql = `update onlineDrivers set Status='answeredToPassangers' where driversId='${req.body.driverId}' and Status='requestedByPassangers'`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.json(results);
      return;
    }
  });
  // res.json({ title: "ok" });
});
app.post("/Driver/rejected/passangerRequest", (req, res) => {
  console.log(req.body.driverId);

  let sql = `update onlineDrivers set Status='RejectedByDriver' where driversId='${req.body.driverId}' and (Status='answeredToPassangers' or Status='requestedByPassangers')`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.json(results);
      return;
    }
  });
  // res.json({ title: "ok" });
});
app.post("/cancelRequestByPassangers", (req, res) => {
  let passangersId = req.body.passangersId,
    sql = `update onlineDrivers set Status='canceledByPassangers' where  passangersId='${passangersId}'  and ( status='requestedByPassangers' or status='answeredToPassangers')`;
  connection.query(sql, (err, result) => {
    res.json({ title: "iiiiiiiiiiiiii" });
  });
});

function insertDriversInfo(id, driversLocation, res) {
  let RegisterInDriver = `insert into onlineDrivers(driversId,Status,driversLocation) values ( '${id}', 
  'Active' , '${driversLocation}')`;
  connection.query(RegisterInDriver, (Err, Result) => {
    if (Err) {
      console.log(Err);
    }
    if (Result) {
      res.json(Result);
    }
  });
}
