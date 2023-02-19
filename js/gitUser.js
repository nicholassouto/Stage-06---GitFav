export class GitUsers {
  static search(username) {
    const gituser = `https://api.github.com/users/${username}`;

    return fetch(gituser)
      .then((data) => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers,
      }));
  }
}
