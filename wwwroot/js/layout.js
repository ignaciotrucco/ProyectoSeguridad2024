window.addEventListener('DOMContentLoaded', event => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
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

    if (currentPath === '/' || currentPath === '/Home' || currentPath === '/Home/Index') {
        currentPath = '/Home/Index';
    }

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath === href) {
            link.classList.add('active');
        }
    });

    const isCollapseAdminOpen = getCollapseState('collapseAdminState');
    const isCollapseGrafOpen = getCollapseState('collapseGrafState');

    if (currentPath === '/' || currentPath === '/Home' || currentPath === '/Home/Index') {
        setCollapseState('collapseAdminState', false);
        setCollapseState('collapseGrafState', false);
    } else {
        if (isCollapseAdminOpen) {
            collapseAdminElement.classList.add('show');
        } else {
            collapseAdminElement.classList.remove('show');
        }

        if (isCollapseGrafOpen) {
            collapseGrafElement.classList.add('show');
        } else {
            collapseGrafElement.classList.remove('show');
        }
    }
});

function getCollapseState(key) {
    return localStorage.getItem(key) === 'open';
}

function setCollapseState(key, isOpen) {
    localStorage.setItem(key, isOpen ? 'open' : 'closed');
}

const collapseAdminElement = document.getElementById('collapseAdmin');
const collapseGrafElement = document.getElementById('collapseGraf');

const collapseAdminButton = document.querySelector('[data-bs-target="#collapseAdmin"]');
const collapseGrafButton = document.querySelector('[data-bs-target="#collapseGraf"]');

if (collapseAdminButton) {
    collapseAdminButton.addEventListener('shown.bs.collapse', () => setCollapseState('collapseAdminState', true));
    collapseAdminButton.addEventListener('hidden.bs.collapse', () => setCollapseState('collapseAdminState', false));
}

if (collapseGrafButton) {
    collapseGrafButton.addEventListener('shown.bs.collapse', () => setCollapseState('collapseGrafState', true));
    collapseGrafButton.addEventListener('hidden.bs.collapse', () => setCollapseState('collapseGrafState', false));
}

document.addEventListener("DOMContentLoaded", function() {
    const handleCollapseAnimations = (element, enterClass, leaveClass) => {
        element.addEventListener('show.bs.collapse', function() {
            element.classList.add(enterClass);
            element.classList.remove(leaveClass);
        });

        element.addEventListener('shown.bs.collapse', function() {
            element.classList.remove(enterClass);
            element.classList.add(`${enterClass}-active`);
        });

        element.addEventListener('hide.bs.collapse', function() {
            element.classList.add(leaveClass);
            element.classList.remove(`${enterClass}-active`);
        });

        element.addEventListener('hidden.bs.collapse', function() {
            element.classList.remove(leaveClass);
        });
    };

    handleCollapseAnimations(collapseAdminElement, 'collapse-admin-enter', 'collapse-admin-leave');
    handleCollapseAnimations(collapseGrafElement, 'collapse-graf-enter', 'collapse-graf-leave');
});
