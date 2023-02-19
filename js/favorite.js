import { GitUsers } from "./gitUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);

    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@gitfav-saved:")) || [];
  }

  save() {
    localStorage.setItem("@gitfav-saved:", JSON.stringify(this.entries));
  }

  screenControl() {
    const tbdoy1 = document.querySelector(".tbody1");
    const tbody2 = document.querySelector(".tbody2");

    if (this.entries.length == 0) {
      tbdoy1.classList.add("hide");
      tbody2.classList.remove("hide");
    } else {
      tbdoy1.classList.remove("hide");
      tbody2.classList.add("hide");
    }
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login.toUpperCase() === username.toUpperCase());
      if (userExists) {
        throw new Error("Favorito ja cadastrado!");
      }
      const user = await GitUsers.search(username);
      if (user.login === undefined) {
        throw new Error("Usuário não encontrando!");
      }
      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter((entry) => entry.login !== user.login);

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody.tbody1");

    this.update();
    this.onadd();
  }

  onadd() {
    const favoriteBtn = this.root.querySelector(".favorite-search button");
    favoriteBtn.onclick = () => {
      const { value } = this.root.querySelector(".favorite-search input");
      this.add(value);
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();
      row.querySelector(".user img").src = `http://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Imagem de ${user.name}`;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;
      row.querySelector(".action").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar este favorito?");
        if (isOk) {
          this.delete(user);
        }
      };
      this.tbody.append(row);
    });
    this.screenControl();
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `    
    <td class="user">
      <img src="https://github.com/nicholassouto.png" alt="imagem do proprietario do repositorio" />
      <a href="https://github.com/nicholassouto" target="_blank">
        <p>Nicholas Souto</p>
        <span>/nicholassouto</span>
      </a>
     </td>
     <td class="repositories">123</td>
     <td class="followers">1234</td>
     <td>
       <button class="action">Remove</button>
     </td>
    `;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
