import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";


const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

let mongoClient;

if (process.env.NODE_ENV === "development") {
  globalThis._mongoClient ??= new MongoClient(uri);
  mongoClient = globalThis._mongoClient;
} else {
  mongoClient = new MongoClient(uri, { maxIdleTimeMS: 5000 });
  attachDatabasePool(mongoClient);
}

const db = mongoClient.db("studiospace");


export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: mongoClient,
  }),

  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: ["http://localhost:3000", process.env.BETTER_AUTH_URL].filter(
    Boolean,
  ),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    autoSignIn: true,

  
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: "jwt",
    },
  },

  plugins: [
    jwt({
      sessionCookieCache: true,
    }),
  ],

  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {},
});
