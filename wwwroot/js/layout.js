window.addEventListener('DOMContentLoaded', event => {
    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.list-group-item');
    let currentPath = window.location.pathname;

    // Define el camino por defecto para la página de inicio
    if (currentPath === '/' || currentPath === '/Home' || currentPath === '/Home/Index') {
        currentPath = '/Home/Index';
    }

    // Resalta el enlace activo
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath === href) {
            link.classList.add('active');
        }
    });

    // Maneja el estado del collapse
    const isCollapseOpen = getCollapseState();

    // Cierra el collapse si estás en la página de inicio
    if (currentPath === '/' || currentPath === '/Home' || currentPath === '/Home/Index') {
        setCollapseState(false); // Asegúrate de cerrar el collapse
    } else {
        if (isCollapseOpen) {
            collapseElement.classList.add('show');
        } else {
            collapseElement.classList.remove('show');
        }
    }
});

// Función para obtener el estado del collapse
function getCollapseState() {
    return localStorage.getItem('collapseAdminState') === 'open';
}

// Función para establecer el estado del collapse
function setCollapseState(isOpen) {
    localStorage.setItem('collapseAdminState', isOpen ? 'open' : 'closed');
}

// Configurar el estado inicial del collapse
const collapseElement = document.getElementById('collapseAdmin');
const collapseButton = document.querySelector('[data-bs-target="#collapseAdmin"]');

if (collapseButton) {
    collapseButton.addEventListener('shown.bs.collapse', () => setCollapseState(true));
    collapseButton.addEventListener('hidden.bs.collapse', () => setCollapseState(false));
}

