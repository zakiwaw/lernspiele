import { NextRequest, NextResponse } from "next/server";
import { getStore, hasPersistentStorage } from "@/lib/storage";
import { defaultProgressState, ProgressState } from "@/lib/types";

export async function GET() {
  try {
    const store = getStore();
    const data = (await store.get()) ?? defaultProgressState();
    return NextResponse.json({
      ok: true,
      persistent: hasPersistentStorage(),
      data,
    });
  } catch (err) {
    console.error("GET /api/progress error", err);
    return NextResponse.json(
      { ok: false, persistent: hasPersistentStorage(), error: "Fortschritt konnte nicht geladen werden." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ProgressState>;
    if (!body || typeof body !== "object" || !body.children) {
      return NextResponse.json({ ok: false, error: "Ungültige Daten." }, { status: 400 });
    }
    const state: ProgressState = {
      children: body.children as ProgressState["children"],
      activeProfile: body.activeProfile ?? null,
      updatedAt: new Date().toISOString(),
    };
    const store = getStore();
    await store.set(state);
    return NextResponse.json({ ok: true, persistent: hasPersistentStorage(), data: state });
  } catch (err) {
    console.error("POST /api/progress error", err);
    return NextResponse.json(
      { ok: false, persistent: hasPersistentStorage(), error: "Fortschritt konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}
