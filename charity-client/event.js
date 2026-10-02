// Extract the event ID from the URL query string (e.g., event.html?id=1)
const params = new URLSearchParams(window.location.search);
const eventId = params.get('id');
const detailContainer = document.getElementById('event-detail');

if (!eventId) {
    detailContainer.textContent = 'No event selected.';
} else {
    // Fetch the specific event details from the API
    fetch(`http://localhost:3000/api/events/${eventId}`)
        .then(response => {
            if (!response.ok) throw new Error('Event not found');
            return response.json();
        })
        .then(event => {
            // Build the page using native DOM methods
            const title = document.createElement('h1');
            title.textContent = event.title;

            const badge = document.createElement('span');
            badge.className = 'category-badge';
            badge.textContent = event.category_name;

            const meta = document.createElement('p');
            meta.className = 'event-meta';
            // Backend returns date as a clean string (YYYY-MM-DD)
            meta.textContent = `Organised by ${event.org_name} | ${event.event_date} | ${event.location}`;

            const description = document.createElement('p');
            description.className = 'event-description';
            description.textContent = event.description;

            // Goal vs Progress section
            const progressSection = document.createElement('div');
            progressSection.className = 'progress-section detail-progress';

            const progressText = document.createElement('div');
            progressText.className = 'progress-text';
            const percent = ((event.current_amount / event.goal_amount) * 100).toFixed(1);
            progressText.textContent = `Raised $${event.current_amount} out of $${event.goal_amount} (${percent}%)`;

            const progressBg = document.createElement('div');
            progressBg.className = 'progress-bg';
            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressFill.style.width = `${Math.min(percent, 100)}%`;

            progressBg.appendChild(progressFill);
            progressSection.appendChild(progressText);
            progressSection.appendChild(progressBg);

            // Ticket information and Register button
            const ticketInfo = document.createElement('p');
            ticketInfo.className = 'ticket-info';
            ticketInfo.textContent = `Ticket Price: $${event.ticket_price}`;

            const registerBtn = document.createElement('button');
            registerBtn.className = 'btn-primary register-btn';
            registerBtn.textContent = 'Register';
            registerBtn.onclick = () => {
                alert('This feature is currently under construction.');
            };

            // Assemble the detail page
            detailContainer.appendChild(badge);
            detailContainer.appendChild(title);
            detailContainer.appendChild(meta);
            detailContainer.appendChild(description);
            detailContainer.appendChild(progressSection);
            detailContainer.appendChild(ticketInfo);
            detailContainer.appendChild(registerBtn);
        })
        .catch(error => {
            console.error('Error fetching event details:', error);
            detailContainer.textContent = 'Failed to load event details.';
        });
}