async function loadCategories() {
    try {
        const response = await fetch('http://localhost:3000/api/categories');
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
        const events = await response.json();

        if (events.length === 0) {
            const msg = document.createElement('p');
            msg.className = 'no-results';
            msg.textContent = 'No events found matching your criteria.';
            resultsContainer.appendChild(msg);
            return;
        }

        events.forEach(event => {
            const card = document.createElement('div');
            card.className = 'event-card';

            const body = document.createElement('div');
            body.className = 'card-body';

            const badge = document.createElement('span');
            badge.className = 'category-badge';
            badge.textContent = event.category_name;

            const title = document.createElement('h3');
            title.textContent = event.title;

            const details = document.createElement('p');
            details.className = 'event-details';
            // Backend now returns clean date strings (YYYY-MM-DD)
            details.textContent = `Date: ${event.event_date} | Location: ${event.location}`;

            const link = document.createElement('a');
            link.href = `event.html?id=${event.event_id}`;
            link.className = 'btn-view';
            link.textContent = 'View Details';

            body.appendChild(badge);
            body.appendChild(title);
            body.appendChild(details);
            body.appendChild(link);
            card.appendChild(body);
            resultsContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Search failed:', error);
        const errorMsg = document.createElement('p');
        errorMsg.className = 'no-results';
        errorMsg.style.color = 'red';
        errorMsg.textContent = 'Something went wrong. Please try again.';
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