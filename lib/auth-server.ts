import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UserRole } from '@/lib/types';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  cafeOwner?: {
    id: string;
    businessName: string;
    isVerified: boolean;
  } | null;
  investor?: {
    id: string;
    kycStatus: string;
    totalInvested: number;
  } | null;
}

/**
 * Parses cookies from standard Cookie header string
 */
function parseCookies(cookieHeader: string | null): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      list[name] = decodeURIComponent(value);
    }
  });

  return list;
}

/**
 * Extracts and verifies user identity against the SQLite database.
 * Does NOT blindly trust client-supplied roles or unverified IDs.
 * Checks HTTP header 'x-cafecircle-user-id' or cookie 'cc_user_id'.
 */
export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  try {
    const headerUserId = request.headers.get('x-cafecircle-user-id');
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    const candidateUserId = headerUserId || cookies['cc_user_id'];

    if (!candidateUserId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: candidateUserId },
      include: {
        cafeOwner: true,
        investor: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      cafeOwner: user.cafeOwner ? {
        id: user.cafeOwner.id,
        businessName: user.cafeOwner.businessName,
        isVerified: user.cafeOwner.isVerified,
      } : null,
      investor: user.investor ? {
        id: user.investor.id,
        kycStatus: user.investor.kycStatus,
        totalInvested: user.investor.totalInvested,
      } : null,
    };
  } catch (error) {
    console.error('Error verifying authenticated user in auth-server:', error);
    return null;
  }
}

/**
 * Guard requiring that an existing database user session is present.
 */
export async function requireAuth(request: Request): Promise<{ user: AuthenticatedUser | null; error: NextResponse | null }> {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Unauthorized: A verified user session is required.' },
        { status: 401 }
      ),
    };
  }
  return { user, error: null };
}

/**
 * Guard requiring that the user possesses a specific role in the database.
 */
export async function requireRole(
  request: Request,
  allowedRoles: UserRole | UserRole[]
): Promise<{ user: AuthenticatedUser | null; error: NextResponse | null }> {
  const { user, error } = await requireAuth(request);
  if (error || !user) {
    return { user: null, error };
  }

  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!rolesArray.includes(user.role as UserRole)) {
    return {
      user: null,
      error: NextResponse.json(
        { error: `Forbidden: This action requires one of the following roles: ${rolesArray.join(', ')}` },
        { status: 403 }
      ),
    };
  }

  return { user, error: null };
}
