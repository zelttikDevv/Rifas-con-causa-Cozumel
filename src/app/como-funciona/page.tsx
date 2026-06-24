import Link from 'next/link';

export default function ComoFuncionaPage() {
  const pasos = [
    {
      numero: 1,
      titulo: 'Elige tu rifa',
      descripcion: 'Explora las rifas activas en la página principal y selecciona la que más te guste.',
      icono: '️'
    },
    {
      numero: 2,
      titulo: 'Selecciona tus números',
      descripcion: 'Elige hasta 5 números disponibles en la cuadrícula. Los verdes están libres, los amarillos reservados y los rojos ya vendidos.',
      icono: '🔢'
    },
    {
      numero: 3,
      titulo: 'Confirma por WhatsApp',
      descripcion: 'Llena tu nombre y teléfono, y presiona "Confirmar por WhatsApp". Se abrirá un chat con tu reserva prellenada.',
      icono: ''
    },
    {
      numero: 4,
      titulo: 'Realiza el pago',
      descripcion: 'Envía el comprobante de pago por WhatsApp. Nuestro equipo confirmará tu pago y tus números pasarán a estado "Pagado".',
      icono: '💸'
    },
    {
      numero: 5,
      titulo: 'Verifica tu boleto',
      descripcion: 'Después del sorteo, usa la opción "Verifica tu Boleto" en la página principal ingresando tu ID de transacción.',
      icono: ''
    }
  ];

  const faqs = [
    {
      pregunta: '¿Cuántos boletos puedo comprar por persona?',
      respuesta: 'Puedes seleccionar hasta 5 números por cada transacción. Si deseas más, puedes hacer otra reserva con un ID de transacción diferente.'
    },
    {
      pregunta: '¿Qué pasa si no pago mi reserva?',
      respuesta: 'Las reservas no pagadas se liberan automáticamente después de 24 horas para que otros puedan comprar esos números.'
    },
    {
      pregunta: '¿Cómo sé si gané?',
      respuesta: 'Una vez finalizada la rifa y publicados los resultados, ve a la página principal, haz clic en "Verifica tu Boleto" e ingresa el ID de transacción que te enviamos por WhatsApp.'
    },
    {
      pregunta: '¿Cómo recibo mi premio si gano?',
      respuesta: 'Si tu boleto es ganador y está pagado, nuestro equipo te contactará directamente por WhatsApp para coordinar la entrega del premio.'
    },
    {
      pregunta: '¿Es seguro comprar aquí?',
      respuesta: 'Totalmente. Todas las rifas son verificadas, los resultados se basan en sorteos oficiales (Lotería Nacional) o tómbolas transmitidas en vivo por Facebook. Además, tu reserva queda registrada con un ID único.'
    }
  ];

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-primary hover:underline text-sm mb-6 inline-block">
          ← Volver al inicio
        </Link>

        {/* Encabezado */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            ¿Cómo funciona?
          </h1>
          <p className="text-gray-600 text-lg">
            Comprar tu boleto es muy fácil. Solo sigue estos 5 pasos.
          </p>
        </div>

        {/* Pasos */}
        <div className="space-y-4 mb-12">
          {pasos.map((paso) => (
            <div 
              key={paso.numero} 
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex gap-4 items-start"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                {paso.icono}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  Paso {paso.numero}: {paso.titulo}
                </h3>
                <p className="text-gray-600 mt-1">{paso.descripcion}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Preguntas Frecuentes */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
             Preguntas Frecuentes
          </h2>
          
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details 
                key={idx} 
                className="group border border-gray-200 rounded-md overflow-hidden"
              >
                <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors font-semibold text-gray-800 list-none">
                  <span>{faq.pregunta}</span>
                  <span className="text-primary text-xl transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="p-4 bg-white text-gray-600 border-t border-gray-200">
                  {faq.respuesta}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Call to action final */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">¿Listo para participar?</p>
          <Link 
            href="/"
            className="inline-block bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all"
          >
            Ver Rifas Activas
          </Link>
        </div>
      </div>
    </main>
  );
              }
