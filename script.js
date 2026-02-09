

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initQuiz();
  initCarousel();
  initApi();
});


function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', links.classList.contains('is-open'));
  });

  document.querySelectorAll('.nav-links a').forEach((a) => {
    a.addEventListener('click', () => links.classList.remove('is-open'));
  });
}

const QUIZ_DATA = [
  {
    question: 'What does CSS stand for?',
    options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style System', 'Colorful Style Sheets'],
    correct: 0
  },
  {
    question: 'Which HTML tag is used for the largest heading?',
    options: ['<h6>', '<heading>', '<h1>', '<head>'],
    correct: 2
  },
  {
    question: 'Which property is used to change the background color?',
    options: ['color', 'bgcolor', 'background-color', 'background'],
    correct: 2
  },
  {
    question: 'What does API stand for?',
    options: ['Application Program Interface', 'Advanced Programming Input', 'Automated Protocol Integration', 'Application Programming Interface'],
    correct: 3
  },
  {
    question: 'Which method is used to fetch data from an API in JavaScript?',
    options: ['fetch()', 'get()', 'request()', 'load()'],
    correct: 0
  }
];

function initQuiz() {
  const progressBar = document.getElementById('quizProgressBar');
  const counterEl = document.getElementById('quizCounter');
  const questionEl = document.getElementById('quizQuestion');
  const optionsEl = document.getElementById('quizOptions');
  const nextBtn = document.getElementById('quizNext');
  const contentEl = document.getElementById('quizContent');
  const resultEl = document.getElementById('quizResult');
  const scoreEl = document.getElementById('quizScore');
  const restartBtn = document.getElementById('quizRestart');

  if (!contentEl || !resultEl) return;

  let currentIndex = 0;
  let score = 0;
  let selectedIndex = null;

  function setProgress() {
    const pct = ((currentIndex + 1) / QUIZ_DATA.length) * 100;
    if (progressBar) progressBar.style.setProperty('--quiz-progress', pct + '%');
    if (counterEl) counterEl.textContent = `Question ${currentIndex + 1} of ${QUIZ_DATA.length}`;
  }

  function renderQuestion() {
    const q = QUIZ_DATA[currentIndex];
    if (!q) return;

    questionEl.textContent = q.question;
    optionsEl.innerHTML = '';

    q.options.forEach((opt, i) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.dataset.index = String(i);
      btn.addEventListener('click', () => selectOption(btn, i));
      li.appendChild(btn);
      optionsEl.appendChild(li);
    });

    nextBtn.disabled = true;
    nextBtn.textContent = currentIndex === QUIZ_DATA.length - 1 ? 'Submit' : 'Next';
    selectedIndex = null;
    setProgress();
  }

  function selectOption(btn, index) {
    if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;

    document.querySelectorAll('.quiz-option').forEach((b) => {
      b.classList.remove('selected');
      b.disabled = true;
    });
    btn.classList.add('selected');
    selectedIndex = index;

    const q = QUIZ_DATA[currentIndex];
    const correctBtn = optionsEl.querySelector(`[data-index="${q.correct}"]`);
    correctBtn.classList.add('correct');

    if (index !== q.correct) {
      btn.classList.add('wrong');
    } else {
      score++;
    }

    nextBtn.disabled = false;
  }

  function showResult() {
    contentEl.classList.add('hidden');
    resultEl.classList.remove('hidden');
    scoreEl.textContent = `You scored ${score} out of ${QUIZ_DATA.length}!`;
  }

  function nextQuestion() {
    if (currentIndex < QUIZ_DATA.length - 1) {
      currentIndex++;
      renderQuestion();
    } else {
      showResult();
    }
  }

  function resetQuiz() {
    currentIndex = 0;
    score = 0;
    resultEl.classList.add('hidden');
    contentEl.classList.remove('hidden');
    renderQuestion();
  }

  nextBtn.addEventListener('click', nextQuestion);
  restartBtn.addEventListener('click', resetQuiz);

  renderQuestion();
}

function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const total = slides.length;
  let current = 0;

  function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  createDots();
  goTo(0);
}


const JOKE_API = 'https://official-joke-api.appspot.com/random_joke';
const USERS_API = 'https://jsonplaceholder.typicode.com/users';
const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

const WEATHER_CODES = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Drizzle',
  55: 'Dense drizzle', 61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
  71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Slight showers', 81: 'Moderate showers', 82: 'Violent showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail'
};

function initApi() {
  const tabs = document.querySelectorAll('.api-tab');
  const contentEl = document.getElementById('apiContent');
  const loadingEl = document.getElementById('apiLoading');
  const fetchBtn = document.getElementById('apiFetch');
  const weatherInput = document.getElementById('weatherInput');
  const weatherCity = document.getElementById('weatherCity');

  if (!contentEl || !fetchBtn) return;

  let currentApi = 'joke';

  function setLoading(loading) {
    if (loading) {
      contentEl.classList.add('hidden');
      loadingEl.classList.remove('hidden');
    } else {
      loadingEl.classList.add('hidden');
      contentEl.classList.remove('hidden');
    }
  }

  function showError(message) {
    contentEl.innerHTML = `<p class="api-placeholder" style="color: #f87171;">${message}</p>`;
  }

  function renderJoke(data) {
    contentEl.innerHTML = `
      <p class="joke-setup">${escapeHtml(data.setup)}</p>
      <p class="joke-punchline">${escapeHtml(data.punchline)}</p>
    `;
  }

  function renderUsers(data) {
    const list = Array.isArray(data) ? data.slice(0, 5) : [];
    contentEl.innerHTML = `
      <ul class="user-list">
        ${list.map((u) => `
          <li class="user-item">
            <div class="user-avatar">${(u.name || '?').charAt(0)}</div>
            <div>
              <div class="user-name">${escapeHtml(u.name || '')}</div>
              <div class="user-email">${escapeHtml(u.email || '')}</div>
            </div>
          </li>
        `).join('')}
      </ul>
    `;
  }

  function getWeatherDesc(code) {
    return WEATHER_CODES[code] || 'Unknown';
  }

  function renderWeather(data, cityName) {
    const c = data.current || {};
    const temp = c.temperature_2m != null ? Math.round(c.temperature_2m) : '—';
    const code = c.weather_code != null ? c.weather_code : 0;
    const humidity = c.relative_humidity_2m != null ? c.relative_humidity_2m : '—';
    const wind = c.wind_speed_10m != null ? c.wind_speed_10m : '—';
    const unit = data.current_units && data.current_units.temperature_2m ? data.current_units.temperature_2m : '°C';

    contentEl.innerHTML = `
      <div class="weather-widget">
        <div class="weather-location">${escapeHtml(cityName)}</div>
        <div class="weather-temp">${temp}${unit}</div>
        <p class="weather-desc">${escapeHtml(getWeatherDesc(code))}</p>
        <div class="weather-meta">
          <span class="weather-meta-item"><span class="weather-meta-label">Humidity</span> ${humidity}%</span>
          <span class="weather-meta-item"><span class="weather-meta-label">Wind</span> ${wind} km/h</span>
        </div>
      </div>
    `;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
  }

  async function fetchWeather() {
    const city = (weatherCity && weatherCity.value.trim()) || 'London';
    const geoRes = await fetch(`${GEO_API}?name=${encodeURIComponent(city)}&count=1`);
    if (!geoRes.ok) throw new Error('Geocoding failed');
    const geoData = await geoRes.json();
    const first = geoData.results && geoData.results[0];
    if (!first) throw new Error(`City not found: ${city}`);
    const lat = first.latitude;
    const lon = first.longitude;
    const name = first.name + (first.admin1 ? `, ${first.admin1}` : '');
    const url = `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather fetch failed');
    const data = await res.json();
    renderWeather(data, name);
  }

  async function fetchData() {
    setLoading(true);
    if (currentApi === 'weather') {
      try {
        await fetchWeather();
      } catch (err) {
        showError(err.message || 'Failed to load weather. Try another city.');
        console.error(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    const url = currentApi === 'joke' ? JOKE_API : USERS_API;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (currentApi === 'joke') renderJoke(data);
      else renderUsers(data);
    } catch (err) {
      showError('Failed to load data. Check your connection or try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentApi = tab.dataset.api || 'joke';
      if (weatherInput) {
        weatherInput.classList.toggle('hidden', currentApi !== 'weather');
      }
      contentEl.innerHTML = '<p class="api-placeholder">Click "Fetch Data" to load.</p>';
    });
  });

  fetchBtn.addEventListener('click', fetchData);
}
