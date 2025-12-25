import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import bcrypt from "bcrypt";
import clientPromise from "./lib/mongodb";
import { ObjectId } from "mongodb";

// Cấu hình NextAuth
export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        phone: { label: "Phone", type: "text", placeholder: "0123456789" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const client = await clientPromise;
          const db = client.db();
          const { email, phone, password } = credentials || {};
          if (!password) {
            throw new Error("Vui lòng nhập mật khẩu.");
          }
          if (!email && !phone) {
            throw new Error("Vui lòng nhập email hoặc số điện thoại.");
          }
          if (process.env.NODE_ENV === "development") {
            console.log("Authorize - Finding user with:", { email, phone });
          }
          const user = await db.collection("users").findOne({
            $or: [email ? { email } : null, phone ? { phone } : null].filter(Boolean),
          });
          if (!user) {
            throw new Error("Email hoặc số điện thoại không tồn tại.");
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            throw new Error("Mật khẩu không đúng.");
          }
          if (process.env.NODE_ENV === "development") {
            console.log("Authorize - User found:", { id: user._id.toString(), email: user.email });
          }
          return { id: user._id.toString(), email: user.email, name: user.name };
        } catch (error) {
          console.error("Authorize error:", error.message);
          throw new Error(error.message || "Lỗi xác thực.");
        }
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      profile(profile) {
        if (process.env.NODE_ENV === "development") {
          console.log("Facebook profile:", profile);
        }
        if (!profile.id || !profile.email) {
          console.error("Facebook profile missing required fields:", profile);
          throw new Error("Facebook profile missing required fields");
        }
        return {
          id: profile.id,
          name: profile.name || profile.displayName || "",
          email: profile.email,
          image: profile.picture?.data?.url || null,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      profile(profile) {
        if (process.env.NODE_ENV === "development") {
          console.log("Google profile:", profile);
        }
        if (!profile.sub || !profile.email) {
          console.error("Google profile missing required fields:", profile);
          throw new Error("Google profile missing required fields");
        }
        return {
          id: profile.sub,
          name: profile.name || profile.given_name || "",
          email: profile.email,
          image: profile.picture || null,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      try {
        const client = await clientPromise;
        const db = client.db();
        if (!token.sub) {
          if (process.env.NODE_ENV === "development") {
            console.warn("No token.sub in session callback");
          }
          return session;
        }
        if (!ObjectId.isValid(token.sub)) {
          if (process.env.NODE_ENV === "development") {
            console.warn("Invalid token.sub:", token.sub);
          }
          return session;
        }
        if (process.env.NODE_ENV === "development") {
          console.log("Session callback - Finding user with _id:", token.sub);
        }
        const user = await db
          .collection("users")
          .findOne({ _id: new ObjectId(token.sub) });
        if (!user) {
          if (process.env.NODE_ENV === "development") {
            console.warn("User not found in session callback for token.sub:", token.sub);
          }
          return session;
        }
        session.user = {
          id: token.sub,
          name: user.name || session.user?.name || "",
          email: user.email || session.user?.email || "",
          role: user.role || "user",
          emailVerified: user.emailVerified || false,
          image: user.image || session.user?.image || null,
          gender: user.gender || null,
          dateOfBirth: user.dateOfBirth || null,
          phone: user.phone || null,
          favoriteFonts: user.favoriteFonts || [],
          brideGroomName: user.brideGroomName || "",
        };
        if (process.env.NODE_ENV === "development") {
          console.log("Session callback - Session updated:", session.user);
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error.message);
        return session;
      }
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }
      if (account && profile) {
        if (process.env.NODE_ENV === "development") {
          console.log("JWT callback - Account:", account, "Profile:", profile);
        }
        if (account.provider === "facebook" || account.provider === "google") {
          if (!profile.email) {
            console.error(`Missing email in ${account.provider} profile:`, profile);
            throw new Error(`Missing email in ${account.provider} profile`);
          }
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/dang-nhap",
    error: "/loi-dang-nhap",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.JWT_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);