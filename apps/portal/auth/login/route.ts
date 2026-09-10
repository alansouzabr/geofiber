import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log("Login attempt:", email);

    // 🔥 MOCK (trocar depois por banco)
    if (email !== 'admin' || password !== '123') {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    const token = 'dev-token-123';

    const response = NextResponse.json({
      ok: true,
      user: {
        id: '1',
        name: 'Admin',
        role: 'ROOT',
      },
    });

    // 🔐 COOKIE CORRETO (HTTP ONLY)
    response.cookies.set({
      name: 'gf_token',
      value: token,
      httpOnly: true,
      secure: false, // depois muda pra true com HTTPS
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log("Login OK:", email);
    return response;

  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    );
  }
}
