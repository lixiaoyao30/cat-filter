import './App.css'

export class App {

  constructor(config) {
    this.config = config
    console.log(this.config.default.api.url);
  }

  render(data) {
    if (data == undefined) return []
    return [
      ...this.renderPets(data.male, 'Male'),
      ...this.renderPets(data.female, 'Female')
    ]
  }

  renderPets(pets, type) {
    if (pets == undefined || type == undefined || type === '') return []
    const petsHtml = pets.length > 0 ? pets.map(this.renderPet) : ['<li>No Pets</li>']
    return [
      `<h2>${type}</h2>`,
      '<ul>',
      ...petsHtml,
      '</ul>'
    ]
  }

  renderPet(pet) {
    if (pet == undefined || pet.trim() === '') return ''
    return `<li><span>${pet.trim().substr(0, 1).toUpperCase()}</span>${pet.trim()}</li>`
  }

  sortByName(data) {
    if (data == undefined) return
    return Object.keys(data).reduce((object, key) => {
      object[key] = (data[key] || []).sort()
      return object;
    }, {})
  }

  categorize(data) {
    if (data == undefined) return
    return data
      .filter(item => ['male', 'female'].indexOf(item.gender.toLowerCase()) >= 0)
      .reduce((petsByGender, item) => {
        const key = item.gender.toLowerCase()
        petsByGender[key] = petsByGender[key].concat(
          (item.pets || []).filter(pet => pet.type === 'Cat')
          .map(pet => pet.name)
        )
        return petsByGender
      }, {
        male: [],
        female: []
      })
  }

  fetch(url) {
    if (url == undefined) throw new Error('Missing url!')
    return window.fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(response.statusText)
      })
  }

  renderLoader() {
    return ['<div class="loader">Loading...</div>']
  }

  renderError(error) {
    return [`<div class="error">FAILED: ${error.message || 'Something went wrong'}</div>`]
  }

  start() {
    const target = document.getElementById('root')
    return Promise.resolve()
      .then(this.renderLoader)
      .then(loader => target.innerHTML = loader.join('\n'))
      .then(this.fetch.bind(this, this.config.default.api.url))
      .then(this.categorize)
      .then(this.sortByName)
      .then(this.render.bind(this))
      .catch(this.renderError)
      .then(html => target.innerHTML = html.join('\n'))
  }
}