const toggler = document.querySelector('#toggler');
const mobileDropdown = document.querySelector('.mobile__view--dropdown');

const togglerHandler = () => {
  mobileDropdown.classList.toggle('open');
};

toggler.addEventListener('click', togglerHandler);
