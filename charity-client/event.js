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

function eventImage(eventId) {
    return EVENT_IMAGES[eventId] || 'images/2.png';
}

function categoryClass(categoryId) {
    return CATEGORY_CLASSES[categoryId] || '';
}

// Extract the event ID from the URL query string (e.g., event.html?id=1)
const params = new URLSearchParams(window.location.search);
const eventId = params.get('id');
const detailContainer = document.getElementById('event-detail');

if (!eventId) {
    const msg = document.createElement('p');
    msg.className = 'no-results';
    msg.textContent = 'No event selected. Please go back to the Home page and choose an event.';
    detailContainer.appendChild(msg);
} else {
    fetch(`http://localhost:3000/api/events/${eventId}`)
        .then(response => {
            if (!response.ok) throw new Error('Event not found');
            return response.json();
        })
        .then(event => {
            // --- Left column: media-style card (image + about the event) ---
            const infoWrapper = document.createElement('div');
            infoWrapper.className = 'detail-info-wrapper';

            const detailImage = document.createElement('img');
            detailImage.className = 'detail-image';
            detailImage.src = eventImage(event.event_id);
            detailImage.alt = event.title;

            const body = document.createElement('div');
            body.className = 'detail-body';

            const badge = document.createElement('span');
            badge.className = 'category-badge ' + categoryClass(event.category_id);
            badge.textContent = event.category_name;

            const title = document.createElement('h1');
            title.textContent = event.title;

            const meta = document.createElement('p');
            meta.className = 'event-meta';

            const orgText = document.createElement('span');
            orgText.className = 'meta-org';
            orgText.textContent = event.org_name;

            const dot1 = document.createElement('span');
            dot1.className = 'meta-dot';
            dot1.textContent = '|';

            const dateItem = document.createElement('span');
            dateItem.className = 'meta-item';
            dateItem.textContent = event.event_date;

            const dot2 = document.createElement('span');
            dot2.className = 'meta-dot';
            dot2.textContent = '|';

            const locItem = document.createElement('span');
            locItem.className = 'meta-item';
            locItem.textContent = event.location;

            meta.appendChild(orgText);
            meta.appendChild(dot1);
            meta.appendChild(dateItem);
            meta.appendChild(dot2);
            meta.appendChild(locItem);

            const description = document.createElement('p');
            description.className = 'event-description';
            description.textContent = event.description;

            body.appendChild(badge);
            body.appendChild(title);
            body.appendChild(meta);
            body.appendChild(description);

            infoWrapper.appendChild(detailImage);
            infoWrapper.appendChild(body);

            // --- Right column: sticky action card ---
            const actionWrapper = document.createElement('div');
            actionWrapper.className = 'detail-action-wrapper';

            const actionTitle = document.createElement('p');
            actionTitle.className = 'action-title';
            actionTitle.textContent = 'Help this cause';

            const percent = event.goal_amount > 0 ? ((event.current_amount / event.goal_amount) * 100).toFixed(1) : 0;

            const percentBlock = document.createElement('div');
            percentBlock.className = 'action-percent';
            const percentNum = document.createElement('span');
            percentNum.className = 'percent-num';
            percentNum.textContent = percent + '%';
            const percentLabel = document.createElement('span');
            percentLabel.className = 'percent-label';
            percentLabel.textContent = 'of goal raised';
            percentBlock.appendChild(percentNum);
            percentBlock.appendChild(percentLabel);

            const progressBg = document.createElement('div');
            progressBg.className = 'progress-bg';
            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressFill.style.width = `${Math.min(percent, 100)}%`;
            progressBg.appendChild(progressFill);

            const progressText = document.createElement('div');
            progressText.className = 'progress-text';
            const raisedSpan = document.createElement('span');
            raisedSpan.className = 'raised';
            raisedSpan.textContent = `$${event.current_amount} raised`;
            const goalSpan = document.createElement('span');
            goalSpan.textContent = `Goal: $${event.goal_amount}`;
            progressText.appendChild(raisedSpan);
            progressText.appendChild(goalSpan);

            const ticketInfo = document.createElement('p');
            ticketInfo.className = 'ticket-info';
            const ticketLabel = document.createElement('span');
            ticketLabel.className = 'ticket-label';
            ticketLabel.textContent = 'Ticket Price';
            const currency = document.createElement('span');
            currency.className = 'ticket-currency';
            currency.textContent = '$';
            ticketInfo.appendChild(ticketLabel);
            ticketInfo.appendChild(currency);
            ticketInfo.appendChild(document.createTextNode(event.ticket_price));

            const registerBtn = document.createElement('button');
            registerBtn.className = 'btn-primary register-btn';
            registerBtn.textContent = 'Register';
            registerBtn.onclick = () => {
                alert('This feature is currently under construction.');
            };

            const note = document.createElement('p');
            note.className = 'action-note';
            note.textContent = 'Registration opens soon \u2014 stay tuned!';

            actionWrapper.appendChild(actionTitle);
            actionWrapper.appendChild(percentBlock);
            actionWrapper.appendChild(progressBg);
            actionWrapper.appendChild(progressText);
            actionWrapper.appendChild(ticketInfo);
            actionWrapper.appendChild(registerBtn);
            actionWrapper.appendChild(note);

            // --- Assemble the page ---
            detailContainer.appendChild(infoWrapper);
            detailContainer.appendChild(actionWrapper);
        })
        .catch(error => {
            console.error('Error fetching event details:', error);
            const errorMsg = document.createElement('p');
            errorMsg.className = 'no-results error';
            errorMsg.textContent = 'Failed to load event details. Please make sure the API server is running, then try again.';
            detailContainer.appendChild(errorMsg);
        });
}
