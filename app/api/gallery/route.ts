import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID || "darul-hidayah";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const q = searchParams.get("q")?.trim().toLowerCase() || "";
  const prog = searchParams.get("prog") || "";
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const limit = Math.min(Math.max(1, Number(searchParams.get("limit") || "24")), 100);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    // 1. Fetch organization info & programs
    const [orgRes, progRes] = await Promise.all([
      supabase.from("organizations").select("*").eq("id", ORG_ID).maybeSingle(),
      supabase.from("programs").select("*").eq("organization_id", ORG_ID).order("name"),
    ]);

    const allMediaCounts: any[] = [];
    let fromCount = 0;
    let hasMoreCount = true;
    while (hasMoreCount) {
      const { data, error } = await supabase
        .from("media")
        .select("program_id")
        .eq("organization_id", ORG_ID)
        .range(fromCount, fromCount + 1000 - 1);
      if (error) break;
      if (data && data.length > 0) {
        allMediaCounts.push(...data);
        if (data.length < 1000) hasMoreCount = false;
        else fromCount += 1000;
      } else {
        hasMoreCount = false;
      }
    }

    const progCountMap: Record<string, number> = {};
    allMediaCounts.forEach((r: any) => {
      if (r.program_id) {
        progCountMap[r.program_id] = (progCountMap[r.program_id] || 0) + 1;
      }
    });

    const programsWithCount = (progRes.data || []).map((p: any) => ({
      ...p,
      count: progCountMap[p.id] || 0,
    }));

    // 2. Fetch paginated media
    let query = supabase
      .from("media")
      .select("*", { count: "exact" })
      .eq("organization_id", ORG_ID)
      .order("created_at", { ascending: false });

    if (prog) {
      query = query.eq("program_id", prog);
    }

    if (q) {
      query = query.or(`id.ilike.%${q}%,filename.ilike.%${q}%,title.ilike.%${q}%`);
    }

    const { data: mediaList, error, count } = await query.range(from, to);
    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      organization: orgRes.data || { id: ORG_ID, name: "Masjid Darul Hidayah" },
      programs: programsWithCount,
      total_media: allMediaCounts.length,
      data: mediaList || [],
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
        has_more: page < totalPages,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message || "Gagal memuat galeri",
        data: [],
      },
      { status: 500 }
    );
  }
}
