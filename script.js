// BASE DE DATOS INICIAL DE IMÁGENES Y AUTOS
const porscheGallery = [
  {
    title: 'Porsche 356 Speedster',
    year: '1954',
    category: 'clasicos',
    hp: '60 HP',
    speed: '155 km/h',
    engine: '1.5L Boxeador 4 cilindros',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Porsche 911 Carrera RS',
    year: '1973',
    category: 'clasicos',
    hp: '210 HP',
    speed: '245 km/h',
    engine: '2.7L 6 cilindros Boxer',
    url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Porsche 911 GT3 RS',
    year: '2023',
    category: 'deportivos',
    hp: '525 HP',
    speed: '296 km/h',
    engine: '4.0L Atmosférico 6 cilindros',
    url: 'https://images.unsplash.com/photo-1541348263662-e082662d82da?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Porsche 918 Spyder',
    year: '2015',
    category: 'hypercars',
    hp: '887 HP',
    speed: '345 km/h',
    engine: 'V8 4.6L + 2 Motores Eléctricos',
    url: 'https://images.unsplash.com/photo-1611821064430-0d40291d0f0d?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Porsche Taycan Turbo S',
    year: '2024',
    category: 'deportivos',
    hp: '761 HP',
    speed: '260 km/h',
    engine: 'Motores Eléctricos Síncronos',
    url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80'
  }
];

let currentFilterClass = '';
let currentAlbum = 'all';

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
  renderGallery();
  setupCarousel();
  setupUpload();
});

// MOSTRAR GALERÍA CON ÁLBUMES Y FILTROS APLICADOS
function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = '';

  const filteredData = currentAlbum === 'all' 
    ? porscheGallery 
    : porscheGallery.filter(item => item.category === currentAlbum);

  if (filteredData.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--silver-metallic);">No hay imágenes en este álbum aún.</p>';
    return;
  }

  filteredData.forEach(item => {
    const card = document.createElement('div');
    card.className = `gallery-item ${currentFilterClass}`;
    card.onclick = () => openModal(item.title, item.year, item.hp, item.speed, item.engine, item.url);

    card.innerHTML = `
      <img src="${item.url}" alt="${item.title}">
      <div class="gallery-overlay">
        <div>
          <h4>${item.title}</h4>
          <small style="color: var(--silver-metallic);">${item.year}</small>
        </div>
        <i class="fa-solid fa-circle-info" style="color: var(--silver-bright);"></i>
      </div>
    `;

    grid.appendChild(card);
  });
}

// CAMBIAR ÁLBUM
function switchAlbum(albumCategory) {
  currentAlbum = albumCategory;
  
  document.querySelectorAll('.album-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');

  renderGallery();
}

// APLICAR FILTROS VISUALES DE IMAGEN
function applyFilter(filterName) {
  switch (filterName) {
    case 'bw': currentFilterClass = 'filter-bw'; break;
    case 'sepia': currentFilterClass = 'filter-sepia'; break;
    case 'contrast': currentFilterClass = 'filter-contrast'; break;
    case 'silver': currentFilterClass = 'filter-silver'; break;
    default: currentFilterClass = ''; break;
  }

  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');

  renderGallery();
}

// FUNCIONALIDAD DEL CARRUSEL
function setupCarousel() {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let index = 0;

  nextBtn.addEventListener('click', () => {
    if (index < 2) {
      index++;
      track.style.transform = `translateX(-${index * 320}px)`;
    }
  });

  prevBtn.addEventListener('click', () => {
    if (index > 0) {
      index--;
      track.style.transform = `translateX(-${index * 320}px)`;
    }
  });
}

// SUBIDA DE ARCHIVOS (DESDE TELÉFONO O COMPUTADORA)
function setupUpload() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const form = document.getElementById('uploadForm');

  dropZone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      dropZone.querySelector('p').textContent = `Foto seleccionada: ${e.target.files[0].name}`;
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const file = fileInput.files[0];
    const title = document.getElementById('carTitle').value;
    const year = document.getElementById('carYear').value;

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const newCar = {
          title: title,
          year: year,
          category: 'user',
          hp: 'Especificación del usuario',
          speed: 'Personalizada',
          engine: 'Personalizado',
          url: event.target.result
        };

        porscheGallery.unshift(newCar);
        switchAlbum('user');
        
        // Resetear formulario
        form.reset();
        dropZone.querySelector('p').innerHTML = 'Arrastra tu foto aquí o <span>Haz clic para buscar</span>';
        alert('¡Foto añadida con éxito a tu álbum personalizado!');
      };
      reader.readAsDataURL(file);
    }
  });
}

// MODAL DE ESPECIFICACIONES
function openModal(title, year, hp, speed, engine, url) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalYear').textContent = `Año / Era: ${year}`;
  document.getElementById('modalHp').textContent = hp;
  document.getElementById('modalSpeed').textContent = speed;
  document.getElementById('modalEngine').textContent = engine;
  document.getElementById('modalImg').src = url;

  document.getElementById('specModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('specModal').style.display = 'none';
}

// CERRAR MODAL AL HACER CLIC FUERA
window.onclick = function(event) {
  const modal = document.getElementById('specModal');
  if (event.target === modal) {
    closeModal();
  }
};