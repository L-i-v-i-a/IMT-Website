document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = 'http://localhost:3000/api/news';
  const newsList = document.getElementById('newsList');
  const newsForm = document.getElementById('newsForm');
  const newsTitle = document.getElementById('newsTitle');
  const newsDescription = document.getElementById('newsDescription');
  const newsContent = document.getElementById('newsContent');
  const imageInput = document.getElementById('imageInput');
  const imagePreview = document.getElementById('imagePreview');
  const logoutButton = document.getElementById('logoutButton');
  const formTitle = document.getElementById('formTitle');

  let editNewsId = null;
  console.log(document.getElementById('newsForm'));

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
            <strong>${news.title}</strong> - ${news.description}
            <div>
              ${news.image ? `<img src="${news.image}" alt="${news.title}" width="100" height="100" />` : ''}
              <button onclick="editNews('${news._id}', '${news.title}', '${news.description}', '${news.content}', '${news.image || ''}')">Edit</button>
              <button onclick="deleteNews('${news._id}')">Delete</button>
            </div>
          `;
          newsList.appendChild(listItem);
        });
        alert("News fetched successfully");
      } else {
        console.error('Expected an array of news, but got:', data);
        alert('No news available.');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Failed to fetch news. Please ensure the backend is running and accessible.');
    }
  };

  newsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', newsTitle.value);
    formData.append('description', newsDescription.value);
    formData.append('content', newsContent.value);

    if (imageInput && imageInput.files[0]) {
      formData.append('image', imageInput.files[0]);
    }

    const url = editNewsId ? `${API_BASE_URL}/edit/${editNewsId}` : `${API_BASE_URL}/add`;
    const method = editNewsId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, { method, body: formData });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit news.');
      }

      alert(editNewsId ? 'News updated successfully!' : 'News added successfully!');
      formTitle.textContent = 'Add News';
      editNewsId = null;
      newsForm.reset();
      imagePreview.innerHTML = '';
      fetchNews();
    } catch (error) {
      console.error('Error submitting news:', error);
      alert('Error while submitting news.');
    }
  });

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

  window.editNews = (id, title, description, content, image) => {
    editNewsId = id;
    newsTitle.value = title;
    newsDescription.value = description;
    newsContent.value = content;
    imagePreview.innerHTML = image ? `<img src="${image}" alt="${title}" width="100" height="100" />` : '';
    formTitle.textContent = 'Edit News';
  };

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

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      alert('Logged out successfully!');
      window.location.href = 'login.html';
    });
  }

  fetchNews();
});
