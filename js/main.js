document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const contactForm = document.getElementById("contact-form");
  const navbar = document.getElementById("navbar");

  // [필수 조건 1] 갤러리를 완전히 비우고 다시 그리는 함수 (Re-render)
  function renderGallery(proyectos) {
    gallery.innerHTML = ""; // 기존 카드를 완전히 삭제 (Ocultar 아님)

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
                    <p>${proyecto.descripcion}</p>
                    <button class="btn-detail" data-id="${proyecto.id}">Ver caso de estudio</button>
                </div>
            `;
      gallery.appendChild(card);
    });

    // 각 카드의 버튼을 누르면 상세페이지로 ID를 넘겨주는 기능
    document.querySelectorAll(".btn-detail").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        localStorage.setItem("selectedProjectId", id);
        window.location.href = "proyecto-detalle.html";
      });
    });
  }

  // 처음 로드 시 모든 프로젝트를 갤러리에 표시
  renderGallery(proyectosData);

  // [필수 조건 2] .filter()를 사용한 카테고리 필터링 시스템
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

  // [추가 인터랙션 조건] 스크롤 시 네비게이션 바 디자인 변경
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // [필수 조건 3] IntersectionObserver를 이용한 섹션 스르륵 애니메이션
  const sectionsToObserve = document.querySelectorAll(".observe-me");
  const observerOptions = {
    root: null,
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // 한 번만 애니메이션 실행 후 해제
      }
    });
  }, observerOptions);

  sectionsToObserve.forEach((section) => {
    observer.observe(section);
  });

  // [추가 조건] 연락처 폼 필드 실시간 유효성 검사 및 안내
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
