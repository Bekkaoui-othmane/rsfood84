import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { verifierRateLimit, enregistrerEchec, reinitialiserTentatives } from '@/lib/rateLimit';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const ip =
          req?.headers?.['x-forwarded-for']?.toString().split(',')[0].trim() ||
          req?.headers?.['x-real-ip']?.toString() ||
          'unknown';

        const limit = verifierRateLimit(ip);
        if (!limit.autorise) {
          throw new Error(
            limit.tempsRestant
              ? `Trop de tentatives. Réessayez dans ${Math.ceil(limit.tempsRestant / 60)} min.`
              : 'Trop de tentatives. Réessayez plus tard.'
          );
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });

        if (!admin) {
          enregistrerEchec(ip);
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, admin.password);

        if (!isValid) {
          enregistrerEchec(ip);
          return null;
        }

        reinitialiserTentatives(ip);

        return {
          id: String(admin.id),
          email: admin.email,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/admin-login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
