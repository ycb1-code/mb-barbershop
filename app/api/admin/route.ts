import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { action, username, password, currentPassword, newPassword } = await request.json();

    switch (action) {
      case 'login':
        if (!username || !password) {
          return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        const isAuthenticated = await db.admin.authenticate(username, password);
        if (isAuthenticated) {
          return NextResponse.json({ success: true, message: 'Login successful' });
        } else {
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

      case 'changePassword':
        if (!username || !currentPassword || !newPassword) {
          return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (newPassword.length < 8) {
          return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
        }

        const isChanged = await db.admin.changePassword(username, currentPassword, newPassword);
        if (isChanged) {
          return NextResponse.json({ success: true, message: 'Password changed successfully' });
        } else {
          return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
        }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}