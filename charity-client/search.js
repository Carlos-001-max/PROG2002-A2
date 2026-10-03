// Per-event image map (event_id -> local photo)
const EVENT_IMAGES = {
    1: 'images/2.png',   // Hope Fun Run - starting line
    2: 'images/4.jpg',   // Green Earth Gala - ballroom
    3: 'images/7.jpg',   // Art for Hope Auction - auction room
    4: 'images/5.jpg',   // Earth Songs Concert - concert stage
    5: 'images/6.png',   // Hope Annual Gala - dinner group
    6: 'images/9.jpg',   // Nature Walk - forest trail
    7: 'images/1.png',   // Children First Run - family run
    8: 'images/8.jpg'    // Charity Art Auction - auction hall
};

const CATEGORY_CLASSES = {
    1: 'cat-run',
    2: 'cat-gala',
    3: 'cat-auction',
    4: 'cat-concert'
};

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function eventImage(eventId) {
    return EVENT_IMAGES[eventId] || 'images/2.png';
}

function categoryClass(categoryId) {
    return CATEGORY_CLASSES[categoryId] || '';
}

function dateBadge(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return String(d.getDate()).padStart(2, '0') + ' ' + MONTHS[d.getMonth()];
}

// Build a shared event card element (same pattern as the home page)
function buildEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';

    const imageWrap = document.createElement('div');
    imageWrap.className = 'card-image';

    const img = document.createElement('img');
    img.src = eventImage(event.event_id);
    img.alt = event.title;
    img.loading = 'lazy';

    const dateEl = document.createElement('span');
    dateEl.className = 'date-badge';
    dateEl.textContent = dateBadge(event.event_date);

    imageWrap.appendChild(img);
    imageWrap.appendChild(dateEl);

    const body = document.createElement('div');
    body.className = 'card-body';

    const badge = document.createElement('span');
    badge.className = 'category-badge ' + categoryClass(event.category_id);
    badge.textContent = event.category_name;

    const title = document.createElement('h3');
    title.textContent = event.title;

    const details = document.createElement('p');
    details.className = 'event-details';
    details.textContent = event.location ? `Date: ${event.event_date}  |  Location: ${event.location}` : `Date: ${event.event_date}`;

    const link = document.createElement('a');
    link.href = `event.html?id=${event.event_id}`;
    link.className = 'btn-view';
    link.textContent = 'View Details';

    body.appendChild(badge);
    body.appendChild(title);
    body.appendChild(details);
    body.appendChild(link);

    card.appendChild(imageWrap);
    card.appendChild(body);
    return card;
}

async function loadCategories() {
    try {
        const response = await fetch('http://localhost:3000/api/categories');
        if (!response.ok) throw new Error('API responded with status ' + response.status);
        const categories = await response.json();
        const select = document.getElementById('category');

        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.category_id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

document.getElementById('search-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value.trim();
    const categoryId = document.getElementById('category').value;

    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (location) params.append('location', location);
    if (categoryId) params.append('categoryId', categoryId);

    const resultsContainer = document.getElementById('search-results');

    while (resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.firstChild);
    }

    try {
        const response = await fetch(`http://localhost:3000/api/events/search?${params.toString()}`);
        if (!response.ok) throw new Error('API responded with status ' + response.status);
        const events = await response.json();

        if (events.length === 0) {
            const msg = document.createElement('p');
            msg.className = 'no-results';
            msg.textContent = 'No events found matching your criteria.';
            resultsContainer.appendChild(msg);
            return;
        }

        events.forEach(event => {
            resultsContainer.appendChild(buildEventCard(event));
        });

    } catch (error) {
        console.error('Search failed:', error);
        const errorMsg = document.createElement('p');
        errorMsg.className = 'no-results error';
        errorMsg.textContent = 'Something went wrong. Please make sure the API server is running, then try again.';
        resultsContainer.appendChild(errorMsg);
    }
});

document.getElementById('clear-btn').addEventListener('click', () => {
    document.getElementById('date').value = '';
    document.getElementById('location').value = '';
    document.getElementById('category').value = '';

    const resultsContainer = document.getElementById('search-results');
    while (resultsContainer.firstChild) {
        resultsContainer.removeChild(resultsContainer.firstChild);
    }
});

document.addEventListener('DOMContentLoaded', loadCategories);
