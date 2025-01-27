document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = 'http://localhost:3000/api/news';
  const newsList = document.getElementById('newsList');
  const newsForm = document.getElementById('newsForm');
  const newsTitle = document.getElementById('newsTitle');
  const newsDescription = document.getElementById('newsDescription');
  const newsContent = document.getElementById('newsContent');
  const newsImageInput = document.getElementById('newsImageInput');
  const newsImagePreview = document.getElementById('newsImagePreview');
  const logoutButton = document.getElementById('logoutButton');
  const formTitle = document.getElementById('formTitle');

  let editNewsId = null;

  /**
   * Fetch all news articles and display them in the list.
   */
  const fetchNews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (Array.isArray(data)) {
        newsList.innerHTML = '';

        data.forEach(news => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
            <strong>${news.title}</strong>
            <p>${news.description}</p>
            <p>${news.content}</p>
            <div>
              ${news.image ? `<img src="${news.image}" alt="${news.title}" width="100" height="100" />` : ''}
              <button onclick="editNews('${news._id}', '${news.title}', '${news.description}', '${news.content}', '${news.image || ''}')">Edit</button>
              <button onclick="deleteNews('${news._id}')">Delete</button>
            </div>
          `;
          newsList.appendChild(listItem);
        });
      } else {
        console.error('Expected an array of news articles, but got:', data);
        alert('No news available.');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Failed to fetch news. Please ensure the backend is running and accessible.');
    }
  };

  /**
   * Add or edit news based on the form submission.
   */
  newsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', newsTitle.value);
    formData.append('description', newsDescription.value);
    formData.append('content', newsContent.value);

    if (newsImageInput && newsImageInput.files[0]) {
      formData.append('image', newsImageInput.files[0]);
    }

    const url = editNewsId ? `${API_BASE_URL}/edit/${editNewsId}` : `${API_BASE_URL}/add`;
    const method = editNewsId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, { method, body: formData });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'News added successfully!.');
      }

      alert(editNewsId ? 'News updated successfully!' : 'News added successfully!');
      formTitle.textContent = 'Add News';
      editNewsId = null;
      newsForm.reset();
      newsImagePreview.innerHTML = '';
      fetchNews();
    } catch (error) {
      console.error('Error submitting news:', error);
      alert('News updated successfully!');
    }
  });

  /**
   * Delete a news article by ID.
   */
  window.deleteNews = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete news.');

      alert('News deleted successfully!');
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Failed to delete news. Please try again.');
    }
  };

  /**
   * Edit a news article.
   */
  window.editNews = (id, title, description, content, image) => {
    editNewsId = id;
    newsTitle.value = title;
    newsDescription.value = description;
    newsContent.value = content;
    newsImagePreview.innerHTML = image ? `<img src="${image}" alt="${title}" width="100" height="100" />` : '';
    formTitle.textContent = 'Edit News';
  };

  /**
   * Preview selected image before uploading.
   */
  if (newsImageInput) {
    newsImageInput.addEventListener('change', () => {
      const file = newsImageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          newsImagePreview.innerHTML = `<img src="${reader.result}" alt="Selected Image" width="100" height="100" />`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  /**
   * Handle logout button click.
   */
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      alert('Logged out successfully!');
      window.location.href = 'login.html';
    });
  }

  // Initial fetch of news articles
  fetchNews();
});
