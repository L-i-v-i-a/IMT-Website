document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000/api/galleries';
    const galleryList = document.getElementById('galleryList');
    const galleryForm = document.getElementById('galleryForm');
    const imageCaption = document.getElementById('imageCaption');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const logoutButton = document.getElementById('logoutButton');
    const formTitle = document.getElementById('formTitle');
  
    let editImageId = null;
    
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); 
        console.log('API Response:', data);
    
        if (Array.isArray(data)) {
          galleryList.innerHTML = ''; 
    
          data.forEach(image => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
              <strong>${image.caption}</strong>
              <div>
                ${image.image ? `<img src="${image.image}" alt="${image.caption}" width="100" height="100" />` : ''}
                <button onclick="editGalleryImage('${image._id}', '${image.caption}', '${image.image || ''}')">Edit</button>
                <button onclick="deleteGalleryImage('${image._id}')">Delete</button>
              </div>
            `;
            galleryList.appendChild(listItem);
          });
        } else {
          console.error('Expected an array of gallery images, but got:', data);
          alert('No gallery images available.');
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        alert('Failed to fetch gallery images. Please ensure the backend is running and accessible.');
      }
    };
  
    galleryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append('caption', imageCaption.value);
  
      if (imageInput && imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
      }
  
      const url = editImageId ? `${API_BASE_URL}/edit/${editImageId}` : `${API_BASE_URL}/add`;
      const method = editImageId ? 'PUT' : 'POST';
  
      try {
        const response = await fetch(url, { method, body: formData });
        const data = await response.json();
      
        if (!response.ok) {
          throw new Error(data.error || 'Failed to submit image.');
        }
      
        alert(editImageId ? 'Gallery image updated successfully!' : 'Gallery image added successfully!');
        formTitle.textContent = 'Add Gallery Image';
        editImageId = null;
        galleryForm.reset();
        imagePreview.innerHTML = '';
        fetchGalleryImages(); 
      } catch (error) {
        console.error('Error submitting gallery image:', error);
        alert('Failed to submit gallery image.');
      }
    });
  
    window.deleteGalleryImage = async (id) => {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete image.');
  
        alert('Gallery image deleted successfully!');
        fetchGalleryImages();
      } catch (error) {
        console.error('Error deleting gallery image:', error);
        alert('Failed to delete gallery image. Please try again.');
      }
    };
  
    window.editGalleryImage = (id, caption, image) => {
      editImageId = id;
      imageCaption.value = caption;
      imagePreview.innerHTML = image ? `<img src="${image}" alt="${caption}" width="100" height="100" />` : '';
      formTitle.textContent = 'Edit Gallery Image';
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
  
    fetchGalleryImages();
  });
  