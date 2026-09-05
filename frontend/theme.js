let darkMode = localStorage.getItem('darkMode')
const themeSwitch = document.getElementById('theme-switch');

const enableDarkMode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkMode', 'active');
}

const disableDarkMode = () => {
    document.body.classList.remove('darkmode');
    localStorage.removeItem('darkMode');
}

themeSwitch.addEventListener('click', () => {
    darkMode = localStorage.getItem('darkMode');
    darkMode !== "active" ? enableDarkMode() : disableDarkMode();
})

if(darkMode === "active"){
    enableDarkMode();
} else {
    disableDarkMode();
}
