window.addEventListener("DOMContentLoaded", () => {
    obterInfo(-15.7797200, -47.9297200);
});

function obterLocalizacao() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (posicao) => {
                const { latitude, longitude } = posicao.coords;
                obterInfo(latitude, longitude);
            },
            (erro) => {
                console.error("Erro ao obter localização:", erro);
            }
        );
    } else {
        console.error("Geolocalização não suportada pelo navegador.");
    }
}

async function obterInfo(lat, lon) {
    const apiKey = "2f5a0b6f84054a411276cd040749257c";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            showInfo({
                city: data.name,
                country: data.sys.country,
                temp: data.main.temp,
                sens: data.main.feels_like,
                tempMax: data.main.temp_max,
                tempMin: data.main.temp_min,
                description: data.weather[0].description,
                windSpeed: data.wind.speed,
                humidity: data.main.humidity,
                timezone: data.timezone,
            });
        } else {
            console.error("Erro na API:", data);
        }
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
    }
}

async function obterInfoPorNome(cidade) {
    const apiKey = "2f5a0b6f84054a411276cd040749257c";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            showInfo({
                city: data.name,
                country: data.sys.country,
                temp: data.main.temp,
                sens: data.main.feels_like,
                tempMax: data.main.temp_max,
                tempMin: data.main.temp_min,
                description: data.weather[0].description,
                windSpeed: data.wind.speed,
                humidity: data.main.humidity,
                timezone: data.timezone,
            });
        } else {
            alert("Localização não encontrada.");
        }
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
    }
}

function showInfo({ city, country, temp, sens, tempMax, tempMin, description, windSpeed, humidity, timezone }) {
    document.getElementById('atualLocal').textContent = `Atualmente em ${city}, ${country}`;
    document.getElementById('graus').textContent = `Temperatura: ${temp}°C`;
    document.getElementById('sensacao').textContent = `Sensação Térmica: ${sens}°C`;
    document.getElementById('maxmin').textContent = `Máx: ${tempMax}°C / Mín: ${tempMin}°C`;
    document.getElementById('descmax').textContent = `Condição: ${description.charAt(0).toUpperCase() + description.slice(1)}`;
    document.getElementById('vento').textContent = `Vento: ${windSpeed} Km/h`;
    document.getElementById('umidade').textContent = `Umidade: ${humidity}%`;

    const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    localTimeObj = new Date(utc + timezone * 1000);

    atualizarHoraLocal();
    if (window.timerLocalHora) clearInterval(window.timerLocalHora);
    window.timerLocalHora = setInterval(() => {
        localTimeObj = new Date(localTimeObj.getTime() + 1000);
        atualizarHoraLocal();
    }, 1000);
}

function atualizarHoraLocal() {
    const localTimeObj = new Date();
    const horaFormatada = localTimeObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('hora').textContent = `Horário Local: ${horaFormatada}`;

    const hora = localTimeObj.getHours();
    let periodo;
    if (hora >= 5 && hora < 12) periodo = 'Manhã';
    else if (hora >= 12 && hora < 18) periodo = 'Tarde';
    else periodo = 'Noite';

    document.getElementById('periodo').textContent = periodo;

    const opcoesData = { weekday: 'long', day: 'numeric', month: 'long' };
    let dataFormatada = localTimeObj.toLocaleDateString('pt-BR', opcoesData);
    dataFormatada = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);

    document.getElementById('dataAtual').textContent = dataFormatada;
}

const input = document.getElementById('inputBusca');
const btn = document.getElementById('btnEnviar');

input.addEventListener('input', () => {
    btn.classList.toggle('hidden', input.value.trim() === '');
});

btn.addEventListener('click', () => {
    const cidade = input.value.trim();
    if (cidade) obterInfoPorNome(cidade);
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const cidade = input.value.trim();
        if (cidade) obterInfoPorNome(cidade);
    }
});