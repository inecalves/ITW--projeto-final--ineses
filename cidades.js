const cityData = {
    "Nice": {
        info: "Nice é conhecida por sua bela costa e pelo charme da Riviera Francesa. Durante os Jogos Olímpicos de 2024, sediou competições de vela e futebol.",
        weather: "Soleado, 25°C"
    },
    "Marseille": {
        info: "Marseille é a segunda maior cidade da França, famosa por seu porto histórico. Nos Jogos Olímpicos, foi palco de competições de vela e esportes aquáticos.",
        weather: "Parcialmente nublado, 22°C"
    },
    "Bordeaux": {
        info: "Bordeaux, conhecida mundialmente como a capital do vinho, sediou emocionantes partidas de futebol durante os Jogos Olímpicos de 2024.",
        weather: "Ensolarado, 26°C"
    },
    "Paris": {
        info: "A cidade-luz foi o coração dos Jogos Olímpicos de 2024, sediando eventos icônicos como atletismo, ginástica e as cerimônias de abertura e encerramento.",
        weather: "Ensolarado, 24°C"
    },
    "Nantes": {
        info: "Nantes, localizada no oeste da França, foi anfitriã de competições de futebol durante os Jogos Olímpicos de 2024.",
        weather: "Nublado, 20°C"
    },
    "Lille": {
        info: "Lille é uma cidade vibrante no norte da França, com arquitetura flamenga e eventos culturais. Durante os Jogos Olímpicos, sediou competições de futebol e esportes indoor.",
        weather: "Chuvoso, 18°C"
    }
};

function showCityDetails(city) {
    // Atualizar breadcrumb
    const breadcrumbCities = document.getElementById("breadcrumb-cities");
    breadcrumbCities.classList.remove("active");
    const breadcrumb = document.getElementById("breadcrumb");
    const cityBreadcrumb = document.createElement("li");
    cityBreadcrumb.className = "breadcrumb-item active";
    cityBreadcrumb.id = "breadcrumb-city";
    cityBreadcrumb.setAttribute("aria-current", "page");
    cityBreadcrumb.textContent = city;
    breadcrumb.appendChild(cityBreadcrumb);

    // Mostrar detalhes da cidade
    document.getElementById("scrollspy-content").classList.add("d-none");
    document.getElementById("city-details-container").classList.remove("d-none");
    document.getElementById("city-name").textContent = city;
    document.getElementById("city-info").textContent = cityData[city].info;
    document.getElementById("city-weather").textContent = cityData[city].weather;
}

function goBackToCities() {
    // Atualizar breadcrumb
    const breadcrumbCity = document.getElementById("breadcrumb-city");
    if (breadcrumbCity) breadcrumbCity.remove();
    const breadcrumbCities = document.getElementById("breadcrumb-cities");
    breadcrumbCities.classList.add("active");

    // Mostrar lista de cidades
    document.getElementById("city-details-container").classList.add("d-none");
    document.getElementById("scrollspy-content").classList.remove("d-none");
}
