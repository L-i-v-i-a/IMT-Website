document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = 'http://localhost:3000/api/events';
  const eventsList = document.getElementById('eventsList');
  const eventForm = document.getElementById('eventForm');
  const eventTitle = document.getElementById('eventTitle');
  const eventDescription = document.getElementById('eventDescription');
  const eventDate = document.getElementById('eventDate');
  const eventTime = document.getElementById('eventTime');
  const eventVenue = document.getElementById('eventVenue');
  const moreInfo = document.getElementById('moreInfo');
  const imageInput = document.getElementById('imageInput');
  const imagePreview = document.getElementById('imagePreview');
  const logoutButton = document.getElementById('logoutButton');
  const formTitle = document.getElementById('formTitle');

  let editEventId = null;

  /**
   * Fetch and display all events.
   */
  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        eventsList.innerHTML = '';
        data.forEach(event => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
            <strong>${sanitizeHTML(event.title)}</strong> - ${sanitizeHTML(event.description)} <br>
            Date: ${sanitizeHTML(event.date)}, Time: ${sanitizeHTML(event.time)}, Venue: ${sanitizeHTML(event.venue)}<br>
            More Info: ${sanitizeHTML(event.moreInfo)}
            <div>
              ${event.image ? `<img src="${sanitizeHTML(event.image)}" alt="${sanitizeHTML(event.title)}" width="100" height="100" />` : ''}
              <button onclick="editEvent('${event._id}', '${sanitizeHTML(event.title)}', '${sanitizeHTML(event.description)}', '${sanitizeHTML(event.date)}', '${sanitizeHTML(event.time)}', '${sanitizeHTML(event.venue)}', '${sanitizeHTML(event.moreInfo)}', '${sanitizeHTML(event.image || '')}')">Edit</button>
              <button onclick="deleteEvent('${event._id}')">Delete</button>
            </div>
          `;
          eventsList.appendChild(listItem);
        });
      } else {
        console.error('Expected an array of events, but got:', data);
        alert('No events available.');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to fetch events. Please ensure the backend is running and accessible.');
    }
  };

  /**
   * Add or update an event.
   */
  eventForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', eventTitle.value.trim());
    formData.append('description', eventDescription.value.trim());
    formData.append('date', eventDate.value.trim());
    formData.append('time', eventTime.value.trim());
    formData.append('venue', eventVenue.value.trim());
    formData.append('moreInfo', moreInfo.value.trim());

    if (imageInput && imageInput.files[0]) {
      const file = imageInput.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }
      formData.append('image', file);
    }

    const url = editEventId ? `${API_BASE_URL}/edit/${editEventId}` : `${API_BASE_URL}/add`;
    const method = editEventId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, { method, body: formData });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit event.');
      }

      alert(editEventId ? 'Event updated successfully!' : 'Event added successfully!');
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error submitting event:', error);
      alert('Failed to submit event. Please try again.');
    }
  });

  /**
   * Delete an event by ID.
   */
  window.deleteEvent = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete event.');

      alert('Event deleted successfully!');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  /**
   * Populate form fields for editing an event.
   */
  window.editEvent = (id, title, description, date, time, venue, moreInfo, image) => {
    editEventId = id;
    eventTitle.value = title;
    eventDescription.value = description;
    eventDate.value = date;
    eventTime.value = time;
    eventVenue.value = venue;
    moreInfo.value = moreInfo;
    imagePreview.innerHTML = image ? `<img src="${image}" alt="${title}" width="100" height="100" />` : '';
    formTitle.textContent = 'Edit Event';
  };

  /**
   * Reset the form and preview.
   */
  const resetForm = () => {
    editEventId = null;
    eventForm.reset();
    imagePreview.innerHTML = '';
    formTitle.textContent = 'Add Event';
  };

  /**
   * Sanitize HTML to prevent XSS attacks.
   */
  const sanitizeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  /**
   * Preview selected image.
   */
  if (imageInput) {
    imageInput.addEventListener('change', () => {
      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          imagePreview.innerHTML = `<img src="${reader.result}" alt="Selected Image" width="100" height="100" />`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  /**
   * Logout functionality.
   */
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      alert('Logged out successfully!');
      window.location.href = 'login.html';
    });
  }

  // Fetch all events on page load.
  fetchEvents();
});
