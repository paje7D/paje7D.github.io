document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. RECURSO DINÂMICO 1: Modo Escuro / Modo Claro (Dark Mode Toggle)
       ========================================================================== */
    const btnTheme = document.getElementById('btn-theme-toggle');
    const htmlElement = document.documentElement;

    btnTheme.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-bs-theme', newTheme);
        
        // Atualiza o ícone do botão
        const icon = btnTheme.querySelector('i');
        if (newTheme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    /* ==========================================================================
       2. RECURSO DINÂMICO 2: Animação de Contadores Numéricos (Ao rolar a página)
       ========================================================================== */
    const counters = document.querySelectorAll('.counter');
    let animated = false;

    const startCounters = () => {
        const sobreSection = document.getElementById('sobre');
        const sectionPos = sobreSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.3;

        if (sectionPos < screenPos && !animated) {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const speed = 200; // Quanto menor, mais rápido
                const increment = target / speed;

                const updateCount = () => {
                    const count = +counter.innerText;
                    if (count < target) {
                        counter.innerText = Math.ceil(count + increment);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
            animated = true; // Garante que a animação rode apenas uma vez
        }
    };

    window.addEventListener('scroll', startCounters);

    /* ==========================================================================
       3. VALIDAÇÃO DINÂMICA DO FORMULÁRIO E ENVIO FRONT-END (AJAX / Fetch API)
       ========================================================================== */
    const form = document.getElementById('form-contato');
    const formFeedback = document.getElementById('form-feedback');
    const btnSubmit = document.getElementById('btn-submit');
    const spinner = btnSubmit.querySelector('.spinner-border');

    // Função para validar e-mail via Expressão Regular (Regex)
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let isValid = true;
        const nome = document.getElementById('nome');
        const email = document.getElementById('email');
        const assunto = document.getElementById('assunto');
        const mensagem = document.getElementById('mensagem');

        // Validação do Nome
        if (nome.value.trim().length < 3) {
            nome.classList.add('is-invalid');
            isValid = false;
        } else {
            nome.classList.remove('is-invalid');
            nome.classList.add('is-valid');
        }

        // Validação do E-mail
        if (!validateEmail(email.value.trim())) {
            email.classList.add('is-invalid');
            isValid = false;
        } else {
            email.classList.remove('is-invalid');
            email.classList.add('is-valid');
        }

        // Validação do Assunto
        if (assunto.value === '') {
            assunto.classList.add('is-invalid');
            isValid = false;
        } else {
            assunto.classList.remove('is-invalid');
            assunto.classList.add('is-valid');
        }

        // Validação da Mensagem
        if (mensagem.value.trim().length < 10) {
            mensagem.classList.add('is-invalid');
            isValid = false;
        } else {
            mensagem.classList.remove('is-invalid');
            mensagem.classList.add('is-valid');
        }

        // Se o formulário for válido, realiza o envio via Fetch API (Sem recarregar a página)
        if (isValid) {
            // Exibe indicador de carregamento
            spinner.classList.remove('d-none');
            btnSubmit.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formFeedback.className = 'mt-4 alert alert-success d-block';
                    formFeedback.innerText = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                    form.reset();
                    // Limpa as classes de validação verde
                    [nome, email, assunto, mensagem].forEach(el => el.classList.remove('is-valid'));
                } else {
                    throw new Error('Falha no envio');
                }
            } catch (error) {
                formFeedback.className = 'mt-4 alert alert-danger d-block';
                formFeedback.innerText = 'Ops! Houve um erro ao enviar a mensagem. Tente novamente mais tarde.';
            } finally {
                spinner.classList.add('d-none');
                btnSubmit.disabled = false;
            }
        }
    });
});