import { NextRequest, NextResponse } from 'next/server';
import { VDI_4640_TABELLE_1_DATA, formatSoilProfilesPayload } from '@/lib/vdi4640-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('ids');
  const categoryParam = searchParams.get('kategorie');

  let profiles = VDI_4640_TABELLE_1_DATA;

  if (categoryParam) {
    profiles = profiles.filter(p => p.kategorie.toLowerCase() === categoryParam.toLowerCase());
  }

  if (idsParam) {
    const requestedIds = idsParam.split(',').map(id => id.trim()).filter(Boolean);
    profiles = profiles.filter(p => requestedIds.includes(p.id));
  }

  const payload = formatSoilProfilesPayload(profiles);
  return NextResponse.json(payload, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ids: string[] = Array.isArray(body?.ids) ? body.ids : [];

    const profiles = ids.length > 0
      ? VDI_4640_TABELLE_1_DATA.filter(p => ids.includes(p.id))
      : VDI_4640_TABELLE_1_DATA;

    const payload = formatSoilProfilesPayload(profiles);
    return NextResponse.json(payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ungültige Anfrage. Bitte übergeben Sie { "ids": string[] }' },
      { status: 400 }
    );
  }
}
