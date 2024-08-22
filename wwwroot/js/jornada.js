// Obtenemos el checkbox principal, el contenedor de los checkboxes adicionales y el campo de fecha especial
const checkboxPrincipal = document.getElementById('checkboxPrincipal');
const checkboxsAdicionales = document.getElementById('checkboxsAdicionales');
const fechaEspecial = document.getElementById('fechaEspecial');

// Añadimos un evento para detectar cambios en el checkbox principal
checkboxPrincipal.addEventListener('change', function () {
    // Si el checkbox principal está seleccionado, mostramos los checkboxes adicionales y ocultamos la fecha especial
    if (this.checked) {
        checkboxsAdicionales.style.display = 'block';
        fechaEspecial.style.display = 'none';
    } else {
        // Si no está seleccionado, mostramos la fecha especial y ocultamos los checkboxes adicionales
        checkboxsAdicionales.style.display = 'none';
        fechaEspecial.style.display = 'block';
    }
    // Limpiamos los checkboxes adicionales
    const checkboxes = checkboxsAdicionales.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    // Limpiamos el campo de fecha especial
    fechaEspecialInput.value = '';
});