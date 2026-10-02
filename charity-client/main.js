async function loadEvents() {
    const container = document.getElementById('event-list');

    try {
        const response = await fetch('http://localhost:3000/api/events');
        const events = await response.json();

        if (events.length === 0) {
            const msg = document.createElement('p');
            msg.textContent = 'No upcoming events at the moment.';
            container.appendChild(msg);
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

            const percent = (event.current_amount / event.goal_amount) * 100;
            const displayPercent = Math.min(percent, 100).toFixed(0);

            const progressSection = document.createElement('div');
            progressSection.className = 'progress-section';

            const progressText = document.createElement('div');
            progressText.className = 'progress-text';

            const raisedSpan = document.createElement('span');
            raisedSpan.textContent = `Raised: $${event.current_amount}`;

            const goalSpan = document.createElement('span');
            goalSpan.textContent = `Goal: $${event.goal_amount}`;

            progressText.appendChild(raisedSpan);
            progressText.appendChild(goalSpan);

            const progressBg = document.createElement('div');
            progressBg.className = 'progress-bg';

            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressFill.style.width = displayPercent + '%';

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
            card.appendChild(body);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching events:', error);
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Failed to load events. Please make sure the API server is running.';
        errorMsg.style.color = 'red';
        container.appendChild(errorMsg);
    }
}

document.addEventListener('DOMContentLoaded', loadEvents);