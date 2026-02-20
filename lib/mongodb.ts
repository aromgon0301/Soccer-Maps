import { MongoClient, Db } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/soccer_maps"
const dbName = process.env.MONGODB_DB || "soccer_maps"

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
  var _mongoIndexesReady: Promise<void> | undefined
}

const clientPromise: Promise<MongoClient> = global._mongoClientPromise ?? new MongoClient(uri).connect()
if (!global._mongoClientPromise) {
  global._mongoClientPromise = clientPromise
}

export async function getDb(): Promise<Db> {
  const connectedClient = await clientPromise
  const db = connectedClient.db(dbName)

  if (!global._mongoIndexesReady) {
    global._mongoIndexesReady = Promise.all([
      db.collection("users").createIndex({ email: 1 }, { unique: true }),
      db.collection("users").createIndex({ id: 1 }, { unique: true }),
      db.collection("profiles").createIndex({ id: 1 }, { unique: true }),
      db.collection("reservations").createIndex({ id: 1 }, { unique: true }),
      db.collection("reservations").createIndex({ userId: 1, createdAt: -1 }),
      db.collection("community_posts").createIndex({ id: 1 }, { unique: true }),
      db.collection("community_posts").createIndex({ teamId: 1, createdAt: -1 }),
    ]).then(() => undefined)
  }

  await global._mongoIndexesReady
  return db
}
