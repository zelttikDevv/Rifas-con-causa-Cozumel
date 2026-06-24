import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminToken = process.env.ADMIN_TOKEN;

    console.log('[Login API]', {
      passwordProvided: !!password,
      passwordLength: password?.length,
      tokenExists: !!adminToken,
      tokenLength: adminToken?.length,
    });

    if (!adminToken) {
      console.error('[Login API] ADMIN_TOKEN no está configurado');
      return NextResponse.json(
        { ok: false, mensaje: 'Configuración de servidor incorrecta' },
        { status: 500 }
      );
    }

    if (password !== adminToken) {
      console.warn('[Login API] Contraseña incorrecta');
      return NextResponse.json(
        { ok: false, mensaje: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    console.log('[Login API] Contraseña correcta, creando cookie');

    // Crear cookie de sesión
    const response = NextResponse.json({ ok: true, mensaje: 'Login exitoso' });
    response.cookies.set('admin_session', adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    });

    console.log('[Login API] Cookie establecida:', adminToken.substring(0, 10) + '...');

    return response;
  } catch (error) {
    console.error('[Login API] Error:', error);
    return NextResponse.json(
      { ok: false, mensaje: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
