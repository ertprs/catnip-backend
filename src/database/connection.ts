import knex from "knex";

import connectionConfig from "./connectionConfig";

const connection = knex(connectionConfig);

export default connection;