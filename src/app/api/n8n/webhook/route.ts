import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const secret = request.headers.get("x-webhook-secret");
    if (secret !== process.env.N8N_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();

    // Handle different webhook event types from n8n
    switch (payload.event) {
      case "thread_discovered":
      case "comment_status_update":
      case "analytics_update":
        // These will be processed by n8n workflows directly via Supabase
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    );
  }
}
