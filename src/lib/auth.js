
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { Resend } from "resend";

const mongoClient = new MongoClient(process.env.MONGODB_URI);
const db = mongoClient.db("studiospace");
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: mongoClient,
  }),

  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [
    "http://localhost:3000",
    process.env.BETTER_AUTH_URL,
  ].filter(Boolean),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    autoSignIn: true,

    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: user.email,
        subject: "Reset Your StudioSpace Password",
        html: `<h2>Reset Your Password</h2>
          <p>Hello ${user.name || "User"},</p>
          <p>Click below to reset your password.</p>
          <a href="${url}">Reset Password</a>`,
      });
    },
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

