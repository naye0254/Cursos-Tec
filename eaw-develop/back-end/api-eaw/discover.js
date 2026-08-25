/**
 *  Must be located at the root of the project
 *  Run with: node discover.js
 *
 *  TODO: Generate FK relations with camelCase
 */
var fs = require('fs');
var app = require(__dirname + '/server/server');
var dataSource = app.dataSources.MySqlDS_EAW;
function makePromise(f, parent) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      f.call(parent, ...args, (err, ...data) => {
        if (err) return reject(err);
        resolve(data.length === 1 ? data[0] : data);
      });
    });
  };
}
var readFile = makePromise(fs.readFile, fs);
var writeFile = makePromise(fs.writeFile, fs);
function writeSchemas(schemas, ds) {
  var dbName = ds.settings.name;
  // Crear cada archivo json
  return (
    Promise.all(
      schemas.map(data => {
        console.log('dataSchema', data[Object.keys(data)[0]]);
        var schema = data[Object.keys(data)[0]];
        schema.name = schema.options.mysql.table;
        schema.properties = changeProperties(schema.properties);
        return writeFile(
          './common/models/' + schema.options.mysql.table + '.json',
          JSON.stringify(schema, null, '\t'),
        );
      }),
    )
      // Editar archivo y agregar cada modelo
      .then(() => readFile('./server/model-config.json'))
      .then(JSON.parse)
      .then(conf => {
        for (let schema of schemas) {
          conf[schema[Object.keys(schema)[0]].options.mysql.table] = {
            dataSource: dbName,
          };
        }
        return conf;
      })
      .then(conf =>
        writeFile('server/model-config.json', JSON.stringify(conf, null, '\t')),
      )
  );
}
function changeProperties(properties) {
  let propertieFixed = {};
  Object.keys(properties).forEach(property => {
    propertieFixed[properties[property]['mysql']['columnName']] =
      properties[property];
  });
  return propertieFixed;
}
// Consultar metadata
function getSchemas(ds) {
  var discoverSchemas = makePromise(ds.discoverSchemas, ds);
  console.log('Getting schemas');
  var dbName = ds.settings.database;
  return makePromise(
    ds.discoverModelDefinitions,
    ds,
  )({schema: dbName})
    .then(tables =>
      Promise.all(
        tables.map(t => {
          discoverSchemas(t.name, {relations: true, treatBIT1AsBit: true});
        }),
      ),
    )
    .then(data => {
      ds.disconnect();
      return data;
    });
}
Promise.resolve(dataSource)
  .then(ds => getSchemas(ds))
  .then(schemas => writeSchemas(schemas, dataSource))
  .catch(err => console.log(err));
