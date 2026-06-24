import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminToken) {
      return NextResponse.json(
        { ok: false, mensaje: 'Configuración de servidor incorrecta' },
        { status: 500 }
      );
    }

    if (password !== adminToken) {
      return NextResponse.json(
        { ok: false, mensaje: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Crear cookie de sesión
    const response = NextResponse.json({ ok: true, mensaje: 'Login exitoso' });
    response.cookies.set('admin_session', adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { ok: false, mensaje: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
