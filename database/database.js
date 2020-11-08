const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  database: 'code_fury',
  user: 'root',
  password: 'Pavithra@2811'
})

module.exports.connect = () => {
  connection.connect(err => {
    if (err) {
      console.log(err)
      return
    }
    console.log('The database is Connected')
  })
}

module.exports.getAllJobs = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM jobs", [], (err, rows) => {
      if (err) {
        return reject(err)
      }
      console.log("resolving");
      return resolve(rows)
    })
  })
}

module.exports.loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM authentication WHERE email=?", [email], (err, rows) => {
      console.log("err", err);
      console.log("rows", rows);
      if (err) {

        return reject(err)
      }
      if (rows.length === 0) {
        console.log("Inside If")
        return reject("Invalid email ID..")
      }
      if (password === rows[0].password) {
        return resolve(rows[0].sl_no)
      } else {
        return reject("Invalid Password")
      }
    })
  })
}

module.exports.signUpUser = (firstName, lastName, email, password, mobileNumber, qualification, jobExperience, jobSector) => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction(err => {
      if (err) {
        return reject(err)
      }

      connection.query("INSERT INTO signup(first_name, last_name,email,password,mobile_number, qualification, job_experience ,job_sector) VALUES(?,?,?,?,?,?,?,?) ", [firstName, lastName, email, password, mobileNumber, qualification, jobExperience, jobSector], err => {
        if (err) {
          return reject(err)
        }

        connection.query("INSERT Into authentication(email , password, first_name,last_name) VALUES(?,?,?,?) ", [email, password, firstName, lastName], err => {
          if (err) {
            return reject(err)
          }
          connection.commit();
          resolve("User Added Successfully")
        })
      })
    })
  })
}

module.exports.getJobsOfCatagory = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM jobs where job_sectors = ?", [jobSector], (err, rows) => {
      if (err) {
        return reject(err)
      }
      console.log("resolving");
      return resolve(rows)
    })
  })
}

module.exports.postJob = (jobTitle, jobDescription, jobSector, noOfVacancies, ownerEmail) => {
  console.log("JobTitle", jobTitle)
  console.log("jobDescription", jobDescription)
  console.log("jobSector", jobSector)
  console.log("noOfVacancies", noOfVacancies)
  console.log("ownerEmail", ownerEmail)
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO jobs (job_title,job_description,job_sectors,no_of_vacancies,owner_email) VALUES (?,?,?,?,?)", [jobTitle, jobDescription, jobSector, noOfVacancies, ownerEmail], (err, rows) => {
      if (err) {
        return reject(err)
      }
      return resolve("Job Added !")
    })
  })
}