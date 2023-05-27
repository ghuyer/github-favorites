import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    // const entries = [
    //   {
    //     login: 'ghuyer',
    //     name: "Nome Sobrenome",
    //     public_repos: '00',
    //     followers: '00'
    //   }
    // ]

    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      if (this.entries.find(entry => entry.login === username)) {
        throw new Error('Usuário já cadastrado')
      }

      const getGithubUser = await GithubUser.search(username)

      if (getGithubUser.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [getGithubUser, ...this.entries]
      this.update()
      this.save()
    }
    catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = this.root.querySelector('.input-button button');
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.input-button input')

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.avatar img').src = `https://github.com/${user.login}.png`;
      row.querySelector('.avatar img').alt = `Imagem de ${user.name}`;
      row.querySelector('.name p').textContent = user.name;
      row.querySelector('.name span').textContent = user.login;
      row.querySelector('.repositories').textContent = user.public_repos;
      row.querySelector('.followers').textContent = user.followers;
      row.querySelector('.avatar a').href = `https://github.com/${user.login}`;

      row.querySelector('.remove').onclick = () => {
        const ok = confirm('Tem certeza que deseja deletar?')

        if (ok) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })

  }

  createRow() {
    const tr = document.createElement('tr')

    const trData = `
  <td class="avatar">
  <img src="images/hackerman.jpeg" alt="Imagem do usuário">
  <a href="https://github.com/username" target="_blank">
    <div class="name">
      <p>Nome</p>
      <span>/@username</span>
     </div> 
  </td>
  <td class="repositories">repositórios</td>
  <td class="followers">seguidores</td>
  <td class="remove"><span>Remover</span></td>
  `

    tr.innerHTML = trData

    return tr
  }

  removeAllTr() {

    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    });
  }
}