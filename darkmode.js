const lightModeButton = document.getElementById('lightMode');
const darkModeButton = document.getElementById('darkMode');
const body = document.body;

// Função para definir o tema e salvar no localStorage
const setTheme = (theme) => {
    body.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);

    // Atualiza os botões
    if (theme === 'light') {
        lightModeButton.setAttribute('aria-pressed', 'true');
        darkModeButton.setAttribute('aria-pressed', 'false');
    } else if (theme === 'dark') {
        darkModeButton.setAttribute('aria-pressed', 'true');
        lightModeButton.setAttribute('aria-pressed', 'false');
    }
};

// Obtém o tema salvo no localStorage ou usa o tema padrão
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Adiciona eventos de clique nos botões
lightModeButton.addEventListener('click', () => setTheme('light'));
darkModeButton.addEventListener('click', () => setTheme('dark'));