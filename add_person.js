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

function main() {
  let [firstName, lastName, birthday] = process.argv.splice(2, 4);
  knex('famous_people').insert({ 'first_name': firstName,
                                  'last_name' : lastName,
                                  'birthdate' : new Date(birthday) })

                                  .then( res => {
                                    console.log('All Done');
                                    knex.destroy();
                                  })
                                  .catch( err => {
                                    console.log('Error : ' + err);
                                    knex.destroy();
                                  });
}

main();