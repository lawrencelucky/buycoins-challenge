const searchSection = document.querySelector('.search__section');
const profileSection = document.querySelector('.profile__section');
const input = document.querySelector('.search-container input');
const submitBtn = document.querySelector('.submit-btn');
const fullname = document.querySelector('.name');
const username = document.querySelector('.username');
const bio = document.querySelector('.bio');
const profileImg = document.querySelector('.profile-image');
const website = document.querySelector('.website-link');
const userLocation = document.querySelector('.location');
const repoNumber = document.querySelector('.repo-number');
const followersNumber = document.querySelector('.followers-number');
const followingNumber = document.querySelector('.following-number');
const errorMessage = document.querySelector('.error-message');
const loader = document.querySelector('.load');

const query = new URL(location).searchParams;
const origin = window.location.origin;
const path = window.location.pathname;

const searchHandler = (e) => {
  e.preventDefault();
  const searchValue = input.value;

  if (searchValue.length <= 0) {
    return;
  }

  fetchUser(searchValue);

  query.set('username', input.value);
  window.history.replaceState(
    null,
    '',
    origin + path + '?username=' + query.get('username')
  );
};

const pageLoadedHandler = () => {
  const urlString = window.location.href;
  const url = new URL(urlString);
  const param = url.searchParams.get('username');

  if (param === null) {
    return;
  }

  fetchUser(param);
};

const fetchUser = (user) => {
  loader.classList.add('show');
  fetch(`https://api.github.com/users/${user}`)
    .then((response) => response.json())
    .then((data) => {
      profileImg.setAttribute('src', data.avatar_url);
      fullname.innerText = data.name;
      username.innerText = data.login;
      bio.innerText = data.bio;
      userLocation.innerText = data.location;
      repoNumber.innerText = data.public_repos;
      followersNumber.innerText = data.followers;
      followingNumber.innerText = data.following;
      if (!data.blog) {
        website.innerText = 'no blog';
      } else {
        website.innerText = data.blog;
        website.setAttribute('href', data.blog);
      }
      if (data.message === 'Not Found') {
        errorMessage.classList.add('show-error');
        loader.classList.remove('show');
        return;
      }
      searchSection.classList.add('hide');
      profileSection.classList.add('show');
      loader.classList.remove('show');
    })
    .catch((err) => {
      return err;
    });
};

submitBtn.addEventListener('click', searchHandler);
window.addEventListener('DOMContentLoaded', pageLoadedHandler);
