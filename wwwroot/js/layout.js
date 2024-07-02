// // 
// // Scripts
// // 

// window.addEventListener('DOMContentLoaded', event => {

//     // Toggle the side navigation
//     const sidebarToggle = document.body.querySelector('#sidebarToggle');
//     if (sidebarToggle) {
//         // Uncomment Below to persist sidebar toggle between refreshes
//         // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
//         //     document.body.classList.toggle('sb-sidenav-toggled');
//         // }
//         sidebarToggle.addEventListener('click', event => {
//             event.preventDefault();
//             document.body.classList.toggle('sb-sidenav-toggled');
//             localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
//         });
//     }

// });

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

            // Obtén una referencia al wrapper del sidebar
            const sidebarWrapper = document.getElementById('sidebar-wrapper');

            // Establecer un ancho mínimo para el sidebar cuando se cierra
            if (document.body.classList.contains('sb-sidenav-toggled')) {
                sidebarWrapper.style.width = '300px'; // Ajusta este valor según tus necesidades
            } else {
                sidebarWrapper.style.width = ''; // Vuelve al ancho original
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
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