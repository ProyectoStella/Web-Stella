/**
 * Web App para el formulario de contacto del sitio web del Proyecto STELLA.
 * Recibe un POST con JSON y envía el mensaje al correo del proyecto
 * (santatrinidad2026@gmail.com) usando tu propia cuenta de Gmail.
 *
 * ── INSTALACIÓN ────────────────────────────────────────────────────────────
 * 1. Ir a https://script.google.com → "Nuevo proyecto".
 * 2. Borrar el contenido y pegar este archivo completo.
 * 3. Guardar (Ctrl+S) y ponerle un nombre, ej: "Web STELLA - Contacto".
 * 4. Clic en "Implementar" (botón azul) → "Nueva implementación".
 * 5. Tipo de implementación: "Aplicación web".
 * 6. Ejecutar como: "Yo" (santatrinidad2026@gmail.com).
 * 7. Quién tiene acceso: "Cualquier persona".
 * 8. Autorizar los permisos cuando lo pida.
 * 9. Copiar la URL de la aplicación web (termina en /exec).
 * 10. Pegar esa URL en frontend/data/config.json → campo "contacto_endpoint".
 * 11. Desplegar el sitio de nuevo en Firebase.
 * ───────────────────────────────────────────────────────────────────────────
 */

var CORREO_DESTINO = 'santatrinidad2026@gmail.com';
var ASUNTO_PREFIJO = '[Web STELLA] ';

function doPost(e) {
  try {
    var datos = {};
    if (e && e.postData && e.postData.contents) {
      datos = JSON.parse(e.postData.contents);
    }

    var nombre = String(datos.nombre || '').trim();
    var email = String(datos.email || '').trim();
    var asunto = String(datos.asunto || '').trim();
    var mensaje = String(datos.mensaje || '').trim();

    if (!nombre || !email || !asunto || !mensaje) {
      return responder(false, 'Faltan campos obligatorios.');
    }

    var cuerpo =
      'Nombre: ' + nombre + '\n' +
      'Correo del remitente: ' + email + '\n\n' +
      mensaje;

    GmailApp.sendEmail(CORREO_DESTINO, ASUNTO_PREFIJO + asunto, cuerpo, {
      replyTo: email
    });

    return responder(true, 'Mensaje enviado correctamente.');
  } catch (error) {
    return responder(false, 'No se pudo enviar el mensaje. Intentalo de nuevo.');
  }
}

function responder(ok, mensaje) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: ok, mensaje: mensaje }))
    .setMimeType(ContentService.MimeType.JSON);
}
