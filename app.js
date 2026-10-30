(() => {
  'use strict';

  // ---------- Contenido del recorrido (Momento 2) ----------
  const QUESTIONS = [
    {
      id: 'legado',
      text: '¿Qué te gustaría que tu empresa pudiera dejar en otras personas?',
      options: [
        { value: 'oportunidad', label: 'Una oportunidad que antes no tenían' },
        { value: 'recuerdo', label: 'Un recuerdo de colaboración y cercanía' },
        { value: 'certeza', label: 'La certeza de que alguien decidió involucrarse' },
      ],
    },
    {
      id: 'modo',
      text: '¿Cómo te gustaría que tu equipo formara parte de esta historia?',
      options: [
        { value: 'equipo', label: 'Participando juntos en una actividad' },
        { value: 'habilidades', label: 'Aportando sus conocimientos y habilidades' },
        { value: 'explorar', label: 'Explorando primero las oportunidades disponibles' },
      ],
    },
    {
      id: 'barrera',
      text: '¿Qué hace más difícil dar ese primer paso?',
      options: [
        { value: 'tiempo', label: 'La falta de tiempo' },
        { value: 'organizacion', label: 'No saber cómo organizarlo' },
        { value: 'aliado', label: 'No conocer un aliado que nos acompañe' },
      ],
    },
  ];

  // ---------- Contenido de la revelación (Momento 3) ----------
  // Ejemplos ilustrativos: en producción solo deben usarse programas validados por Proa.
  const ECHO = {
    oportunidad: 'Quieres dejar una oportunidad que antes no tenían.',
    recuerdo: 'Quieres dejar un recuerdo de colaboración y cercanía.',
    certeza: 'Quieres dejar la certeza de que alguien decidió involucrarse.',
  };

  const MODES = {
    equipo: {
      title: 'Una actividad de voluntariado en equipo',
      desc: 'Tus colaboradores comparten una jornada junto a una comunidad y viven la experiencia desde dentro, como parte de una iniciativa que Proa ya acompaña.',
      img: 'assets/actividad.jpg',
      alt: 'Una voluntaria de Proa guía una dinámica con tarjetas durante una actividad.',
    },
    habilidades: {
      title: 'Un voluntariado basado en el talento de tu equipo',
      desc: 'Tus colaboradores ponen su experiencia profesional al servicio de una iniciativa social a través de talleres, mentorías o espacios de diálogo.',
      img: 'assets/dba-lima.jpg',
      alt: 'Panel de conversación en el Día de las Buenas Acciones, co-organizado por Proa.',
    },
    explorar: {
      title: 'Una sesión para explorar oportunidades',
      desc: 'Antes de decidir, conoces junto a Proa las iniciativas disponibles y eliges la que mejor encaja con tu empresa y tu equipo.',
      img: 'assets/connect.jpg',
      alt: 'Integrantes de Proa y aliados en el encuentro Proa Connect.',
    },
  };

  const SUPPORT = {
    tiempo: {
      label: '¿Sin tiempo para organizar actividades?',
      text: 'Proa acompaña la planificación del programa de voluntariado corporativo: propone el formato, las fechas y la actividad según la agenda de tu equipo.',
    },
    organizacion: {
      label: '¿No sabes cómo organizarlo?',
      text: 'Proa coordina contigo cada etapa: la convocatoria interna, la logística, la actividad y el cierre con tu equipo.',
    },
    aliado: {
      label: '¿Buscas un aliado que los acompañe?',
      text: 'Proa te conecta con iniciativas que ya conoce y está a tu lado desde la primera conversación hasta el último día de la actividad.',
    },
  };

  const TOTAL_CHAPTERS = QUESTIONS.length + 1;

  // ---------- Referencias ----------
  const $ = (sel) => document.querySelector(sel);
  const storyForm = $('#story-form');
  const storyStep = $('#story-step');
  const storyCount = $('#story-count');
  const storyEnd = $('#story-end');
  const prevBtn = $('#story-prev');
  const nextBtn = $('#story-next');
  const bars = document.querySelectorAll('.progress span');
  const revealSection = $('#revelacion');

  const state = { step: 0, answers: {} };

  // ---------- Recorrido ----------
  function renderStep(moveFocus) {
    const isEnd = state.step >= QUESTIONS.length;
    storyCount.textContent = `Capítulo ${state.step + 1} de ${TOTAL_CHAPTERS}`;
    bars.forEach((bar, i) => bar.classList.toggle('is-on', i <= state.step));

    storyForm.hidden = isEnd;
    storyEnd.hidden = !isEnd;

    if (isEnd) {
      if (moveFocus) $('#story-end-title').focus();
      return;
    }

    const q = QUESTIONS[state.step];
    const current = state.answers[q.id];
    storyStep.innerHTML = `
      <fieldset class="step">
        <legend tabindex="-1">${q.text}</legend>
        ${q.options.map((o) => `
          <label class="option">
            <input type="radio" name="${q.id}" value="${o.value}" ${o.value === current ? 'checked' : ''}>
            <span>${o.label}</span>
          </label>`).join('')}
      </fieldset>`;

    prevBtn.disabled = state.step === 0;
    nextBtn.disabled = !current;
    if (moveFocus) storyStep.querySelector('legend').focus();
  }

  storyForm.addEventListener('change', (e) => {
    if (e.target.type !== 'radio') return;
    state.answers[e.target.name] = e.target.value;
    nextBtn.disabled = false;
  });

  storyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!state.answers[QUESTIONS[state.step].id]) return;
    state.step += 1;
    renderStep(true);
  });

  prevBtn.addEventListener('click', () => {
    if (state.step === 0) return;
    state.step -= 1;
    renderStep(true);
  });

  $('#story-reset').addEventListener('click', () => {
    state.step = 0;
    state.answers = {};
    revealSection.hidden = true;
    renderStep(true);
  });

  // ---------- Revelación ----------
  $('#story-reveal').addEventListener('click', () => {
    const { legado, modo, barrera } = state.answers;
    $('#reveal-echo').textContent = ECHO[legado];
    $('#reveal-title').textContent = MODES[modo].title;
    $('#reveal-desc').textContent = MODES[modo].desc;
    $('#reveal-img').src = MODES[modo].img;
    $('#reveal-img').alt = MODES[modo].alt;
    $('#reveal-support-label').textContent = SUPPORT[barrera].label;
    $('#reveal-support').textContent = SUPPORT[barrera].text;

    revealSection.hidden = false;
    revealSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    $('#reveal-title').focus({ preventScroll: true });
  });

  // Al pasar al formulario desde la revelación, se sugiere la modalidad elegida.
  $('#reveal-cta').addEventListener('click', () => {
    const select = $('#f-modalidad');
    if (state.answers.modo && !select.value) {
      select.value = state.answers.modo;
      validateLead();
    }
  });

  // ---------- Formulario (Momento 4) ----------
  const leadForm = $('#lead-form');
  const leadSubmit = $('#lead-submit');
  const email = $('#f-correo');
  const emailError = $('#f-correo-error');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateLead() {
    const filled = [...leadForm.querySelectorAll('[required]')].every((el) => el.value.trim());
    leadSubmit.disabled = !(filled && EMAIL_RE.test(email.value.trim()));
  }

  leadForm.addEventListener('input', validateLead);
  leadForm.addEventListener('change', validateLead);

  email.addEventListener('blur', () => {
    const bad = email.value.trim() !== '' && !EMAIL_RE.test(email.value.trim());
    email.setAttribute('aria-invalid', bad);
    if (bad) email.setAttribute('aria-describedby', 'f-correo-error');
    else email.removeAttribute('aria-describedby');
    emailError.hidden = !bad;
  });

  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    validateLead();
    if (leadSubmit.disabled) return;

    const nombre = $('#f-nombre').value.trim().split(/\s+/)[0];
    const empresa = $('#f-empresa').value.trim();
    $('#lead-done-title').textContent = `¡Gracias, ${nombre}! Tu capítulo empieza aquí.`;
    $('#lead-done-text').textContent =
      `El equipo de Proa podría contactarte para coordinar una reunión, presentar alternativas para ${empresa} y preparar una propuesta a la medida.`;

    leadForm.hidden = true;
    $('#lead-done').hidden = false;
    $('#lead-done-title').focus();
  });

  $('#lead-reset').addEventListener('click', () => {
    leadForm.reset();
    validateLead();
    $('#lead-done').hidden = true;
    leadForm.hidden = false;
    $('#f-nombre').focus();
  });

  // ---------- Video documental (Momento 1) ----------
  const videoModal = $('#video-modal');
  const storyVideo = $('#story-video');

  $('#video-open').addEventListener('click', () => {
    videoModal.showModal();
    storyVideo.play().catch(() => { /* si el navegador bloquea el autoplay, quedan los controles */ });
  });

  $('#video-close').addEventListener('click', () => videoModal.close());
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) videoModal.close();
  });
  // Al cerrar, el video se detiene y vuelve al inicio.
  videoModal.addEventListener('close', () => {
    storyVideo.pause();
    storyVideo.currentTime = 0;
  });

  // ---------- Detalles de interfaz ----------
  const topbar = $('.topbar');
  const onScroll = () => topbar.classList.toggle('is-solid', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  renderStep(false);
})();
