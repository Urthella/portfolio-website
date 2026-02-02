import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? 'Exists (starts with ' + process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID.substring(0, 3) + ')' : 'Missing',
        NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? 'Exists' : 'Missing',
        NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? 'Exists' : 'Missing',
        NODE_ENV: process.env.NODE_ENV,
    });
}

export const dynamic = 'force-dynamic';
