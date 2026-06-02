document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const contactForm = document.getElementById("contact-form");
  const navbar = document.getElementById("navbar");

  // (Re-render)
  function renderGallery(proyectos) {
    gallery.innerHTML = ""; // (Ocultar)

    if (proyectos.length === 0) {
      gallery.innerHTML = "<p>No se encontraron proyectos.</p>";
      return;
    }

    proyectos.forEach((proyecto) => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `
                <img src="${proyecto.imagen}" alt="Proyecto ${proyecto.titulo}">
                <div class="project-info">
                    <span class="card-category">${proyecto.categoria}</span>
                    <h3>${proyecto.titulo}</h3>
                    <p>${proyecto.descripcion ? proyecto.descripcion : ""}</p>
                    <button class="btn-detail" data-id="${proyecto.id}">Ver caso de estudio</button>
                </div>
            `;
      gallery.appendChild(card);
    });

    // 
    document.querySelectorAll(".btn-detail").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        localStorage.setItem("selectedProjectId", id);
        window.location.href = "proyecto-detalle.html";
      });
    });
  }

  //
  renderGallery(proyectosData);

  // 
  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");

      const categoriaSeleccionada = e.target.getAttribute("data-category");

      if (categoriaSeleccionada === "todos") {
        renderGallery(proyectosData);
      } else {
        // .filter() 필수 사용 구문
        const filtrados = proyectosData.filter(
          (p) => p.categoria === categoriaSeleccionada,
        );
        renderGallery(filtrados);
      }
    });
  });

  // 
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // 
  const sectionsToObserve = document.querySelectorAll(".observe-me");
  const observerOptions = {
    root: null,
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // 
      }
    });
  }, observerOptions);

  sectionsToObserve.forEach((section) => {
    observer.observe(section);
  });

  // 
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");

      if (nameInput.value.trim().length < 2) {
        document.getElementById("name-error").textContent =
          "Por favor, introduce un nombre válido.";
        nameInput.classList.add("input-error");
        isValid = false;
      } else {
        document.getElementById("name-error").textContent = "";
        nameInput.classList.remove("input-error");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        document.getElementById("email-error").textContent =
          "Escribe un correo electrónico correcto.";
        emailInput.classList.add("input-error");
        isValid = false;
      } else {
        document.getElementById("email-error").textContent = "";
        emailInput.classList.remove("input-error");
      }

      if (messageInput.value.trim().length < 10) {
        document.getElementById("message-error").textContent =
          "El mensaje debe tener al menos 10 caracteres.";
        messageInput.classList.add("input-error");
        isValid = false;
      } else {
        document.getElementById("message-error").textContent = "";
        messageInput.classList.remove("input-error");
      }

      if (isValid) {
        const successBox = document.getElementById("form-success");
        successBox.textContent = "¡Mensaje enviado con éxito!";
        successBox.style.display = "block";
        contactForm.reset();
      }
    });
  }
});
