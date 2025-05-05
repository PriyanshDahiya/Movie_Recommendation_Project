document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  console.log("Username:", username); // Check if the username is being retrieved correctly
  if (!username) {
      alert("Please log in first.");
      window.location.href = "../login_page/login.html";
      return;
  }

  // Display username somewhere in the UI if needed
  const usernameDisplay = document.getElementById("username-display");
  if (usernameDisplay) {
    usernameDisplay.textContent = username;
  }

  const likedContainer = document.getElementById("liked-movies-container");
  const recommendedContainer = document.getElementById("recommended-movies-container");
  const allContainer = document.getElementById("all-movies-container");

  // Load Liked Movies
  function loadLikedMovies() {
    likedContainer.innerHTML = '';
    fetch(`http://localhost:7070/auth/liked?username=${username}`)
      .then(res => res.json())
      .then(movies => {
          console.log("Liked Movies:", movies); // Log the response data for liked movies
          if (movies.length === 0) {
              likedContainer.innerHTML = "<p>No liked movies yet.</p>";
          } else {
              movies.forEach(movie => {
                  likedContainer.appendChild(createMovieCard(movie, false));
              });
          }
      })
      .catch(error => console.error("Error fetching liked movies:", error));
  }
  // Removed initial load of liked movies on page load to prevent showing liked movies on main home page
  // loadLikedMovies();

  // Load Recommended Movies with fallback to popular movies if empty
  fetch(`http://localhost:7070/auth/recommendations/${username}`)
      .then(res => res.json())
      .then(movies => {
          console.log("Recommended Movies:", movies); // Log the response data for recommended movies
          if (movies.length === 0) {
              // Show informative message
              recommendedContainer.innerHTML = "<p>No recommendations yet. Like some movies to get personalized recommendations!</p>";
              // Fetch popular movies as fallback
              fetch(`http://localhost:7070/api/movies/all`)
                .then(res => res.json())
                .then(popularMovies => {
                    if (popularMovies.length > 0) {
                        popularMovies.forEach(movie => {
                            recommendedContainer.appendChild(createMovieCard(movie, true));
                        });
                    }
                })
                .catch(error => console.error("Error fetching popular movies for fallback:", error));
          } else {
              movies.forEach(movie => {
                  recommendedContainer.appendChild(createMovieCard(movie, true));
              });
          }
      })
      .catch(error => console.error("Error fetching recommended movies:", error));

  // Load All Movies
  fetch(`http://localhost:7070/api/movies/all`)
      .then(res => res.json())
      .then(movies => {
          console.log("All Movies:", movies); // Log the response data for all movies
          if (movies.length === 0) {
              allContainer.innerHTML = "<p>No movies available.</p>";
          } else {
              movies.forEach(movie => {
                  allContainer.appendChild(createMovieCard(movie, true));
              });
          }
      })
      .catch(error => console.error("Error fetching all movies:", error));

  // Create Movie Card
  function createMovieCard(movie, showLikeButton) {
      const card = document.createElement("div");
      card.className = "movie-card";

card.innerHTML = `
          <img src="${movie.poster || movie.posterUrl || ''}" alt="${movie.title}" onerror="this.onerror=null;this.src='images/image_not_found.jpg';">
          <h3>${movie.title}</h3>
      `;

if (showLikeButton) {
          const btn = document.createElement("button");
          btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
          btn.addEventListener("click", () => {
              likeMovie(username, movie.id);
          });
          card.appendChild(btn);
      }

      return card;
  }

  // Like a movie
  function likeMovie(username, movieId) {
      fetch(`http://localhost:7070/auth/like?username=${username}&movieId=${movieId}`, {
          method: "POST"
      })
      .then(res => res.text())
      .then(msg => {
          alert(msg);
          location.reload();  // refresh to update liked section
      })
      .catch(error => console.error("Error liking the movie:", error));
  }

  // DOM elements
  const appContainer = document.getElementById('app');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userDropdown = document.getElementById('user-dropdown');
  const signInBtn = document.getElementById('sign-in-btn');
  const signOutBtn = document.getElementById('sign-out-btn');
  const searchInput = document.getElementById('search-input');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.content-section');
  const sidebar = document.querySelector('.sidebar');
  const filterPills = document.querySelectorAll('.filter-pill');
  const filterDropdown = document.getElementById('filter-dropdown');
  const logoImg = document.getElementById('logo-img');

  // Search bar input event listener to filter all movies
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const allMoviesContainer = document.getElementById('all-movies-container');
    const movieCards = allMoviesContainer.getElementsByClassName('movie-card');
    Array.from(movieCards).forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      if (title.includes(query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });

  // Set user info in dropdown on page load
  const userNameDisplay = userDropdown.querySelector('.user-dropdown-header p');
  const userEmailDisplay = userDropdown.querySelector('.email');

  if (username) {
    userNameDisplay.textContent = username;
    userEmailDisplay.textContent = username + "@example.com"; // Set email based on username or placeholder
    signInBtn.classList.add('hidden');
    signOutBtn.classList.remove('hidden');
  } else {
    userNameDisplay.textContent = "Guest";
    userEmailDisplay.textContent = "";
    signInBtn.classList.remove('hidden');
    signOutBtn.classList.add('hidden');
  }

  // Sidebar expand/collapse on hover
  sidebar.addEventListener('mouseenter', () => {
      sidebar.classList.add('expanded');
      sidebar.classList.remove('collapsed');
      updateSidebarLabels(true);
      updateMainContentMargin(true);
  });

  sidebar.addEventListener('mouseleave', () => {
      sidebar.classList.remove('expanded');
      sidebar.classList.add('collapsed');
      updateSidebarLabels(false);
      updateMainContentMargin(false);
  });

  function updateSidebarLabels(expanded) {
      const labels = sidebar.querySelectorAll('.sidebar-label');
      labels.forEach(label => {
          label.style.opacity = expanded ? '1' : '0';
          label.style.pointerEvents = expanded ? 'auto' : 'none';
      });
  }

  function updateMainContentMargin(expanded) {
      const mainContent = document.querySelector('.main-content');
      mainContent.style.marginLeft = expanded ? '200px' : '70px';
  }

  // Theme toggle
  themeToggleBtn.addEventListener('click', () => {
      if (appContainer.classList.contains('dark')) {
          appContainer.classList.remove('dark');
          appContainer.classList.add('light');
          themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
          logoImg.src = 'images/logo-light.png';
      } else {
          appContainer.classList.remove('light');
          appContainer.classList.add('dark');
          themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
          logoImg.src = 'images/logo.png';
      }
  });

  // User menu toggle
  userMenuBtn.addEventListener('click', () => {
      userDropdown.classList.toggle('hidden');
  });

  // Sign in/out buttons toggle
  signInBtn.addEventListener('click', () => {
      signInBtn.classList.add('hidden');
      signOutBtn.classList.remove('hidden');
      userDropdown.classList.add('hidden');
  });

  signOutBtn.addEventListener('click', () => {
      signOutBtn.classList.add('hidden');
      signInBtn.classList.remove('hidden');
      userDropdown.classList.add('hidden');
      window.location.href = "../login_page/login.html";
  });

  // Navigation between sections
  navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetSection = link.getAttribute('data-section');
          if (!targetSection) return;

          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          sections.forEach(section => {
              section.classList.toggle('active', section.id === targetSection);
          });

          searchInput.value = '';
          // filterContent function is not defined, removing call to avoid error

          // Load liked movies when liked section is activated
          if (targetSection === 'liked') {
              loadLikedMovies();
          }
      });
  });

  // Sidebar navigation between sections
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetSection = link.getAttribute('data-section');
          if (!targetSection) return;

          sidebarLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          sections.forEach(section => {
              section.classList.toggle('active', section.id === targetSection);
          });

          searchInput.value = '';
          

          // Load liked movies when liked section is activated
          if (targetSection === 'liked') {
              const username = localStorage.getItem("username");
              const likedContainer = document.getElementById("liked-movies-container");
              likedContainer.innerHTML = '';
              fetch(`http://localhost:7070/auth/liked?username=${username}`)
                  .then(res => res.json())
                  .then(movies => {
                      if (movies.length === 0) {
                          likedContainer.innerHTML = "<p>No liked movies yet.</p>";
                      } else {
                          movies.forEach(movie => {
                              likedContainer.appendChild(createMovieCard(movie, false));
                          });
                      }
                  })
                  .catch(error => console.error("Error fetching liked movies:", error));
              // Show liked movies container section
              const likedSection = document.getElementById('liked');
              if (likedSection) {
                  likedSection.classList.add('active');
              }
          }
      });
  });

  // Filter pills dropdown toggle
  filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
          filterDropdown.classList.toggle('hidden');
          const rect = pill.getBoundingClientRect();
          filterDropdown.style.top = rect.bottom + window.scrollY + 'px';
          filterDropdown.style.left = rect.left + window.scrollX + 'px';
      });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (event) => {
      if (!userDropdown.contains(event.target) && !userMenuBtn.contains(event.target)) {
          userDropdown.classList.add('hidden');
      }
      if (!filterDropdown.contains(event.target) && !Array.from(filterPills).some(pill => pill.contains(event.target))) {
          filterDropdown.classList.add('hidden');
      }
  });

  // Render cards
  function renderCards(containerId, items) {
      const container = document.getElementById(containerId);
      container.innerHTML = '';
      items.forEach(item => {
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
              <img src="${item.thumbnail}" alt="${item.title}" />
              <div class="card-content">
                  <h3>${item.title}</h3>
                  <div class="text-sm">
                      <span>${item.views}</span> &bull; <span>${item.uploaded}</span>
                  </div>
              </div>
          `;
          card.addEventListener('click', () => openOverlay(item));
          container.appendChild(card);
      });
  }
});
