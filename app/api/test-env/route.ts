import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        message: 'Environment Variable Check',
        timestamp: new Date().toISOString(),
        env: {
            NODE_ENV: process.env.NODE_ENV,
            SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? `Present (starts with ${process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID.substring(0, 3)}...)` : 'MISSING',
            TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? 'Present' : 'MISSING',
            PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? 'Present' : 'MISSING',
        }
    });
}
