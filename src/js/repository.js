import { token } from './auth.js';

const repositoryContainer = document.querySelector('.all__repos');
const totalRepoCount = document.querySelectorAll('.total-repo-count');
const fullname = document.querySelector('.name');
const username = document.querySelector('.username');
const bio = document.querySelectorAll('.bio');

let repoMarkup = `
<div class="repository">
  <div class="left-container">
    <a href="/" class="repo__title">{%REPO_TITLE%}</a>
    <p class="repo__desc">
      {%REPO_DESC%}
    </p>
    <div class="repo__footer">
      <div class="language-container {%REPO_LANG%}">
        <span class="bull {%REPO_LANG%}"></span>
        <p class="language">{%REPO_LANG%}</p>
      </div>
      <div class="star-container">
        <img src="./assets/star.svg" alt="star" class="icon" />
        <p class="star-number">{%REPO_STAR%}</p>
      </div>
      <div class="fork-container">
        <img src="./assets/fork.svg" alt="fork" class="icon" />
        <p class="fork-number">{%REPO_FORK%}</p>
      </div>
      <p class="updated-date">Updated on {%REPO_DAY%} {%REPO_MONTH%}</p>
    </div>
  </div>
  <div class="right-container">
    <button class="button">
      <img src="./assets/star.svg" alt="star" class="icon" /> Star
    </button>
  </div>
</div>
`;

const body = {
  query: `
    query { 
            viewer {
                login
                name
                avatarUrl
                bio
                repositories(first: 20, privacy: PUBLIC, orderBy: {field: UPDATED_AT, direction: DESC}) {
                  totalCount
                    nodes {
                        name,
                        updatedAt,
                        forkCount,
                        stargazerCount,
                        description,
                        primaryLanguage{
                        name
                    }
                }
            }
        }
    }
    `,
};

const baseURL = 'https://api.github.com/graphql';
const headers = {
  'Content-Type': 'application/json',
  Authorization: `bearer ${token}`,
};

fetch(baseURL, {
  method: 'POST',
  headers,
  body: JSON.stringify(body),
})
  .then((response) => {
    return response.json();
  })
  .then((response) => {
    const name = response.data.viewer.name;
    const login = response.data.viewer.login;
    const bioData = response.data.viewer.bio;
    const repoData = response.data.viewer.repositories.nodes;
    const repoCount = response.data.viewer.repositories.totalCount;

    totalRepoCount.forEach((count) => {
      count.innerText = repoCount;
    });
    bio.forEach((data) => {
      data.innerText = bioData;
    });
    fullname.innerText = name;
    username.innerText = login;

    repoData.map((repo) => {
      const date = new Date(repo.updatedAt);
      const month = monthHandler(date.getMonth());
      const day = date.getDate();

      let output = repoMarkup.replace(/{%REPO_TITLE%}/g, repo.name);
      output = output.replace(/{%REPO_FORK%}/g, repo.forkCount);
      output = output.replace(/{%REPO_STAR%}/g, repo.stargazerCount);
      output = output.replace(/{%REPO_DAY%}/g, day);
      output = output.replace(/{%REPO_MONTH%}/g, month);
      if (repo.description === null) {
        output = output.replace(/{%REPO_DESC%}/g, '');
      } else {
        output = output.replace(/{%REPO_DESC%}/g, repo.description);
      }
      if (repo.primaryLanguage === null) {
        output = output.replace(/{%REPO_LANG%}/g, 'null');
      } else {
        output = output.replace(/{%REPO_LANG%}/g, repo.primaryLanguage.name);
      }

      repositoryContainer.insertAdjacentHTML('beforeend', output);
    });
  })
  .catch((err) => {
    return err;
  });

const monthHandler = (month) => {
  switch (month) {
    case 0:
      return 'Jan';
    case 1:
      return 'Feb';
    case 2:
      return 'Mar';
    case 3:
      return 'Apr';
    case 4:
      return 'May';
    case 5:
      return 'Jun';
    case 6:
      return 'Jul';
    case 7:
      return 'Aug';
    case 8:
      return 'Sep';
    case 9:
      return 'Oct';
    case 10:
      return 'Nov';
    default:
      return 'Dec';
  }
};
