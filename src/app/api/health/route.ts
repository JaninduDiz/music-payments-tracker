import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function GET() {
  try {
    // Perform a simple query to check the database connection
    const { error } = await supabase
      .from('members')
      .select('id')
      .limit(1);

    if (error) {
      // If there's an error from Supabase, the connection is likely down or misconfigured
      throw error;
    }

    // If the query succeeds, the database is healthy
    return NextResponse.json({ status: 'ok', message: 'Database connection is healthy.' }, { status: 200 });
  } catch (error: any) {
    console.error('Database health check failed:', error);
    // If any other error occurs, return a server error response
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Database connection failed.',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
