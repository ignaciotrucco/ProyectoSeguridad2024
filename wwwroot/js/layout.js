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

    // Define the default path for the home page
    if (currentPath === '/' || currentPath === '/Home' || currentPath === '/Home/Index') {
        currentPath = '/Home/Index';
    }

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath === href) {
            link.classList.add('active');
        }
    });
});

// Función para obtener el estado del collapse
function getCollapseState() {
    return localStorage.getItem('collapseAdminState') === 'open';
}

// Función para establecer el estado del collapse
function setCollapseState(isOpen) {
    localStorage.setItem('collapseAdminState', isOpen ? 'open' : 'closed');
}

// Obtener el estado inicial del collapse
const isCollapseOpen = getCollapseState();

// Configurar el estado inicial del collapse
const collapseElement = document.getElementById('collapseAdmin');
if (isCollapseOpen) {
    collapseElement.classList.add('show');
} else {
    collapseElement.classList.remove('show');
}

// Escuchar los eventos de cambio de estado del collapse
const collapseButton = document.querySelector('[data-bs-target="#collapseAdmin"]');
collapseButton.addEventListener('shown.bs.collapse', () => setCollapseState(true));
collapseButton.addEventListener('hidden.bs.collapse', () => setCollapseState(false));
