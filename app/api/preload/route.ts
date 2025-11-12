import { NextResponse } from "next/server";
import { preloadDennerleData } from "@/lib/preload-data";

export async function POST() {
  try {
    const projectId = await preloadDennerleData();
    return NextResponse.json({ success: true, projectId });
  } catch (error) {
    console.error("Error preloading data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to preload data" },
      { status: 500 }
    );
  }
}

