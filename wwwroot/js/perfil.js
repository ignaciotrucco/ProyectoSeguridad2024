function validateForm() {
    const oldPassword = document.getElementById("old-password").value.trim();
    const newPassword = document.getElementById("new-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const errorMessage = document.getElementById("error-message");

    errorMessage.innerText = "";

    // Validar que todos los campos estén llenos
    if (!oldPassword || !newPassword || !confirmPassword) {
        errorMessage.innerText = "Todos los campos son obligatorios.";
        return false;
    }

    // Validar que la nueva contraseña sea distinta de la actual
    if (oldPassword === newPassword) {
        errorMessage.innerText = "La nueva contraseña no puede ser igual a la actual.";
        return false;
    }

    // Validar que la confirmación de contraseña coincida
    if (newPassword !== confirmPassword) {
        errorMessage.innerText = "La confirmación de la contraseña no coincide.";
        return false;
    }

    return true;
}
