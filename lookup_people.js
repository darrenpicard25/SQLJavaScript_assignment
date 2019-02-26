const {Client} = require("pg");
const settings = require("./settings"); // settings.json

const client = new Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
   });

function fixBirthdate (birthdate) {
  return birthdate.getFullYear() + "-" + (birthdate.getMonth() + 1) + "-" + birthdate.getDate();
}
function printResults (arr, personName) {
  console.log(`Found ${arr.length} person(s) by the name '${personName}'`);
  for (let person of arr)
    console.log(`- ${person.id}: ${person.first_name} ${person.last_name}, born '${fixBirthdate(person.birthdate)}'`);
}

function main () {
  const personName = process.argv[2];
  const sqlString = `SELECT id, first_name, last_name, birthdate
                    FROM famous_people
                    WHERE (first_name LIKE $1::TEXT) OR (last_name LIKE $1::TEXT);`;
  makeRequestToDB(sqlString, personName);
}

function makeRequestToDB (requestString, requestName) {
  client.connect((err) => {
    if (err) {
      return console.error("Connection Error", err);
    }
    console.log('Searching........');
    client.query(requestString, ['%'+requestName+'%'], (err, result) => {
      if (err) {
        return console.error("error running query", err);
      }
      printResults(result.rows, requestName);
      client.end();
    });
  });
}

main();