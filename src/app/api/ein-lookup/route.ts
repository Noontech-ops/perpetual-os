import { NextRequest, NextResponse } from 'next/server';

const NTEE_TO_SECTOR: Record<string, string> = {
  A: 'arts_culture',
  B: 'education',
  C: 'environment',
  D: 'environment',
  E: 'health',
  F: 'health',
  G: 'health',
  H: 'health',
  I: 'essential_rights',
  J: 'human_services',
  K: 'human_services',
  L: 'housing',
  M: 'health',
  N: 'community',
  O: 'human_services',
  P: 'human_services',
  Q: 'science',
  R: 'essential_rights',
  S: 'community',
  T: 'community',
  U: 'science',
  V: 'essential_rights',
  W: 'community',
  X: 'essential_rights',
  Y: 'essential_rights',
  Z: 'community',
};

export async function GET(request: NextRequest) {
  const ein = request.nextUrl.searchParams.get('ein');
  if (!ein) return NextResponse.json({ error: 'ein required' }, { status: 400 });

  const cleanEin = ein.replace(/\D/g, '');
  if (cleanEin.length !== 9) return NextResponse.json({ error: 'Invalid EIN format' }, { status: 400 });

  try {
    const res = await fetch(
      `https://projects.propublica.org/nonprofits/api/v2/organizations/${cleanEin}.json`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      if (res.status === 404) return NextResponse.json({ found: false });
      return NextResponse.json({ found: false });
    }

    const data = await res.json();
    const org = data.organization;

    if (!org) return NextResponse.json({ found: false });

    const nteeCode = (org.ntee_code || '').charAt(0).toUpperCase();
    const sector = NTEE_TO_SECTOR[nteeCode] || 'community';

    return NextResponse.json({
      found: true,
      name: org.name,
      city: org.city,
      state: org.state,
      nteeCode: org.ntee_code,
      sector,
      subsectionCode: org.subseccd,
      rulingDate: org.ruling_date,
      totalRevenue: org.income_amount,
    });
  } catch {
    return NextResponse.json({ found: false });
  }
}
