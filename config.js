var config = {}

config.host = process.env.DOCDB_HOST;
config.authKey = process.env.DOCDB_AUTH_KEY;
config.databaseId = process.env.DOCDB_DB_ID;
config.collectionId = process.env.DOCDB_COLLECTION_ID;

module.exports = config;