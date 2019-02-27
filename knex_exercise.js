const settings = require("./settings");
const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : settings.user,
    password : settings.password,
    database : settings.database
  }
});

function fixBirthdate (birthdate) {
  return  birthdate.toISOString().substring(0, 10);

}
function printResults (arr, personName) {
  console.log(`Found ${arr.length} person(s) by the name '${personName}'`);
  for (let person of arr)
    console.log(`- ${person.id}: ${person.first_name} ${person.last_name}, born '${fixBirthdate(person.birthdate)}'`);
}


function main() {
  let searchName = process.argv[2];
  knex.select('*').from("famous_people")
                  .where('first_name', 'like', '%'+searchName+'%')
                  .orWhere('last_name', 'like', '%'+searchName+'%')

      .then(result => {
        printResults(result, searchName);
        knex.destroy(() => {
          console.log('Closed Connection'); });
          })
      .catch(err => {
        console.log('Err: ' + err);
        });
}


main();