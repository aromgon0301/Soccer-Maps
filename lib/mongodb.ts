import { Db, MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/soccer_maps"

const getDbName = () => {
  if (process.env.MONGODB_DB) {
    return process.env.MONGODB_DB
  }

  try {
    const parsed = new URL(uri)
    const pathname = parsed.pathname.replace("/", "").trim()
    return pathname || "soccer_maps"
  } catch {
    return "soccer_maps"
  }
}

type GlobalMongo = typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

const globalMongo = globalThis as GlobalMongo

const clientPromise =
  globalMongo._mongoClientPromise ||
  new MongoClient(uri, {
    appName: "soccer-maps",
  }).connect()

if (!globalMongo._mongoClientPromise) {
  globalMongo._mongoClientPromise = clientPromise
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db(getDbName())
}
