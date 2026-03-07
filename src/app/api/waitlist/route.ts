import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const waitlistSchema = z.object({
  email: z.string().email("Invalid email format").max(255),
  source: z.string().optional().default("website"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = waitlistSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, source } = result.data;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from("waitlist").insert({
      email,
      source,
      referrer: request.headers.get("referer") ?? null,
      ip_address: request.headers.get("x-forwarded-for")?.split(",")[0] ?? null,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { success: true, message: "You're already on the waitlist!" },
          { status: 200 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { success: true, message: "You're on the list! We'll notify you when Mentionly launches." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
