document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const coursesList = document.getElementById('coursesList');
  const newsList = document.getElementById('newsList');
  const galleryList = document.getElementById('galleryList');
  
  const searchCoursesList = document.getElementById('searchCoursesList');
  const searchNewsList = document.getElementById('searchNewsList');
  const searchGalleryList = document.getElementById('searchGalleryList');

  // Initially clear search result lists
  searchCoursesList.innerHTML = '';
  searchNewsList.innerHTML = '';
  searchGalleryList.innerHTML = '';

  searchButton.addEventListener('click', async () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') return;

    try {
      // Clear previous search results
      searchCoursesList.innerHTML = '';
      searchNewsList.innerHTML = '';
      searchGalleryList.innerHTML = '';

      // Show loading or a message indicating searching is in progress
      searchCoursesList.innerHTML = '<li>Searching...</li>';
      searchNewsList.innerHTML = '<li>Searching...</li>';
      searchGalleryList.innerHTML = '<li>Searching...</li>';

      const response = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();
      console.log('Search Results:', data);

      // Clear "Searching..." message after results are displayed
      searchCoursesList.innerHTML = '';
      searchNewsList.innerHTML = '';
      searchGalleryList.innerHTML = '';

      // Display search results for courses
      if (data.courses.length > 0) {
        data.courses.forEach(course => {
          const listItem = document.createElement('li');
          listItem.textContent = `${course.title} - ${course.description}`;
          searchCoursesList.appendChild(listItem);
        });
      } else {
        searchCoursesList.innerHTML = '<li>No courses found.</li>';
      }

      // Display search results for news
      if (data.news.length > 0) {
        data.news.forEach(newsItem => {
          const listItem = document.createElement('li');
          listItem.textContent = `${newsItem.title} - ${newsItem.description}`;
          searchNewsList.appendChild(listItem);
        });
      } else {
        searchNewsList.innerHTML = '<li>No news found.</li>';
      }

      // Display search results for gallery with images
      if (data.gallery.length > 0) {
        data.gallery.forEach(image => {
          const listItem = document.createElement('li');
          const imgElement = document.createElement('img');
          imgElement.src = image.url;  
          imgElement.alt = image.caption;  
          imgElement.style.maxWidth = '200px'; 
          listItem.appendChild(imgElement);
          listItem.appendChild(document.createTextNode(` - ${image.caption}`));  // Optional: Adding caption text
          searchGalleryList.appendChild(listItem);
        });
      } else {
        searchGalleryList.innerHTML = '<li>No gallery images found.</li>';
      }

    } catch (error) {
      console.error('Error performing search:', error);
      searchCoursesList.innerHTML = '<li>Error fetching results</li>';
      searchNewsList.innerHTML = '<li>Error fetching results</li>';
      searchGalleryList.innerHTML = '<li>Error fetching results</li>';
    }
  });
});
