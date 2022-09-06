// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { errMsg } from "../../../client/src/shared/utils";
import { GoalRequest, Personality, Room, Storyteller } from "../shared/types";
import chalk from "chalk";

// Global Variables
export let roomsCollection: mongoDB.Collection<Room>;

// Initialize Connection
export async function connectToDatabase() {
    dotenv.config();

    let dbConnString = process.env.DB_CONN_STRING;
    if (dbConnString == undefined) {
        errMsg("'DB_CONN_STRING' env variable is undefined.");
        return;
    }
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(dbConnString);
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    let roomsCollectionName = process.env.ROOMS_COLLECTION_NAME
    if (roomsCollectionName == undefined) {
        errMsg("'ROOMS_COLLECTION_NAME' env variable is undefined.");
        return;
    }
    roomsCollection = db.collection(roomsCollectionName);
       
    console.log(chalk.greenBright(`Successfully connected to database: ${db.databaseName} and collection: ${roomsCollection.collectionName}`));
 }