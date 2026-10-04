// Per-event image map (event_id -> local photo)
const EVENT_IMAGES = {
    1: 'images/funrun.png',   // Hope Fun Run - starting line
    2: 'images/gala.jpg',   // Green Earth Gala - ballroom
    3: 'images/auction.jpg',   // Art for Hope Auction - auction room
    4: 'images/concert.jpg',   // Earth Songs Concert - concert stage
    5: 'images/dinner.png',   // Hope Annual Gala - dinner group
    6: 'images/nature.jpg',   // Nature Walk - forest trail
    7: 'images/kidsrun.png',   // Children First Run - family run
    8: 'images/artauction.jpg'    // Charity Art Auction - auction hall
};

const CATEGORY_CLASSES = {
    1: 'cat-run',
    2: 'cat-gala',
    3: 'cat-auction',
    4: 'cat-concert'
};

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function eventImage(eventId) {
    return EVENT_IMAGES[eventId] || 'images/funrun.png';
}

function categoryClass(categoryId) {
    return CATEGORY_CLASSES[categoryId] || '';
}

function dateBadge(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return String(d.getDate()).padStart(2, '0') + ' ' + MONTHS[d.getMonth()];
}

// Build a shared event card element (used by home page and search results)
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

    const progressSection = document.createElement('div');
    progressSection.className = 'progress-section';

    const progressText = document.createElement('div');
    progressText.className = 'progress-text';

    const raisedSpan = document.createElement('span');
    raisedSpan.className = 'raised';
    raisedSpan.textContent = `Raised: $${event.current_amount}`;

    const goalSpan = document.createElement('span');
    goalSpan.textContent = `Goal: $${event.goal_amount}`;

    progressText.appendChild(raisedSpan);
    progressText.appendChild(goalSpan);

    const progressBg = document.createElement('div');
    progressBg.className = 'progress-bg';

    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    const percent = event.goal_amount > 0 ? Math.min((event.current_amount / event.goal_amount) * 100, 100).toFixed(0) : 0;
    progressFill.style.width = percent + '%';

    progressBg.appendChild(progressFill);
    progressSection.appendChild(progressText);
    progressSection.appendChild(progressBg);

    const link = document.createElement('a');
    link.href = `event.html?id=${event.event_id}`;
    link.className = 'btn-view';
    link.textContent = 'View Details';

    body.appendChild(badge);
    body.appendChild(title);
    body.appendChild(details);
    body.appendChild(progressSection);
    body.appendChild(link);

    card.appendChild(imageWrap);
    card.appendChild(body);
    return card;
}

async function loadEvents() {
    const container = document.getElementById('event-list');

    try {
        const response = await fetch('http://localhost:3000/api/events');
        if (!response.ok) throw new Error('API responded with status ' + response.status);
        const events = await response.json();

        if (events.length === 0) {
            const msg = document.createElement('p');
            msg.className = 'no-results';
            msg.textContent = 'No upcoming events at the moment. Check back soon!';
            container.appendChild(msg);
            return;
        }

        events.forEach(event => {
            container.appendChild(buildEventCard(event));
        });

    } catch (error) {
        console.error('Error fetching events:', error);
        const errorMsg = document.createElement('p');
        errorMsg.className = 'no-results error';
        errorMsg.textContent = 'Failed to load events. Please make sure the API server is running on port 3000.';
        container.appendChild(errorMsg);
    }
}

document.addEventListener('DOMContentLoaded', loadEvents);
