import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.MEALIE_BASE_URL;
const TOKEN = process.env.MEALIE_API_TOKEN;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> }
) {
  const { recipeId } = await params;

  if (!BASE_URL || !TOKEN) {
    return new NextResponse("Server misconfigured", { status: 500 });
  }

  const upstream = `${BASE_URL}/api/media/recipes/${recipeId}/images/min-original.webp`;

  const res = await fetch(upstream, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) {
    return new NextResponse("Image not found", { status: res.status });
  }

  const contentType = res.headers.get("content-type") ?? "image/webp";
  const body = await res.arrayBuffer();

  return new NextResponse(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
