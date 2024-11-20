const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; 
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const weatherInfo = document.getElementById('weather-info');

// Initialize chat with a greeting
addMessage("Hello! I'm your weather assistant. Ask me about the weather in any city!", false);

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        await processMessage(message);
    }
});

async function processMessage(message) {
    const cityMatch = message.match(/weather in (\w+)/i);
    if (cityMatch) {
        const city = cityMatch[1];
        await getWeatherData(city);
    } else {
        addMessage("I'm sorry, I didn't understand that. Could you please ask about the weather in a specific city? For example, 'What's the weather in London?'", false);
    }
}

async function getWeatherData(city) {
    try {
        showTypingIndicator();
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = response.data;
        displayWeatherInfo(data);
        const message = `The current weather in ${data.name} is ${data.weather[0].description}. The temperature is ${Math.round(data.main.temp)}°C (feels like ${Math.round(data.main.feels_like)}°C), with ${data.main.humidity}% humidity and wind speed of ${data.wind.speed} m/s.`;
        addMessage(message, false);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        addMessage("I'm sorry, I couldn't find weather information for that city. Could you please try another city?", false);
    } finally {
        removeTypingIndicator();
    }
}

function addMessage(text, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', isUser ? 'user-message' : 'bot-message');
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('typing-indicator');
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = chatMessages.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function displayWeatherInfo(data) {
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    weatherInfo.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-xl font-bold">${data.name}</h2>
                <p class="text-3xl font-bold">${Math.round(data.main.temp)}°C</p>
                <p>${data.weather[0].description}</p>
            </div>
            <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon">
        </div>
    `;
    weatherInfo.classList.remove('hidden');
}