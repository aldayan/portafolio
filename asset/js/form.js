const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const asunto = document.getElementById("asunto");
const mensaje = document.getElementById("mensaje");
const botonEnviar = document.getElementById("enviar");
const parrafo = document.getElementById("alerta");





botonEnviar.addEventListener("click", function(event) {

    event.preventDefault();

    var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var alertas = "";
    var entrar = false;

    if (nombre.value.length < 4) {
        alertas += `nombre no es valido <br>`;
        entrar = true;
    } else
    if (nombre.value.length > 50) {
        alertas += `<br> nombre no es valido <br>`;
        entrar = true;
    }

    if (!regexEmail.test(email.value)) {
        alertas += `<br> email no es valido <br>`;
        entrar = true;

    }
    if (asunto.value.length < 4) {
        alertas += `<br>asunto no es valido <br>`;
        entrar = true;

    } else if (asunto.value.length > 50) {
        alertas += ` <br>asunto no es valido <br>`;
        entrar = true;
    }

    if (mensaje.value.length < 5) {
        alertas += `<br>mensaje no es valido <br>`;
        entrar = true;
    } else if (mensaje.value.length > 300) {
        alertas += `<br>mensaje no es valido <br>`;
        entrar = true;

    }
    if (entrar) {
        parrafo.innerHTML = alertas;
    }


});