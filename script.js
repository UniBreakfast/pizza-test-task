const ingredientList = document.querySelector('.ingredients')
const priceOut = document.querySelector('.price')
const quarters = document.querySelectorAll('.quarter')
const orderBtn = document.querySelector('button.order')
const ingredientsPane = document.querySelector('form>.ingredients')
const ingredientLists = ingredientsPane.querySelectorAll('ul')

const ingredients = {
  base: [
    { value: 'small', label: 'Small', price: 5 },
    { value: 'medium', label: 'Medium', price: 7 },
    { value: 'large', label: 'Large', price: 10 },
    { value: 'thick', label: 'Thick', price: 14 },
  ],
  ingredient1: [
    { value: 'pepperoni', label: 'Pepperoni', price: 3 },
    { value: 'mushrooms', label: 'Mushrooms', price: 2 },
    { value: 'onions', label: 'Onions', price: 1 },
    { value: 'sausage', label: 'Sausage', price: 4 },
  ],
  ingredient2: [
    { value: 'peppers', label: 'Peppers', price: 1 },
    { value: 'olives', label: 'Olives', price: 3 },
    { value: 'bacon', label: 'Bacon', price: 4 },
    { value: 'spinach', label: 'Spinach', price: 2 },
  ],
  sauce: [
    { value: 'tomato', label: 'Catchup', price: 2 },
    { value: 'white', label: 'White sauce', price: 3 },
    { value: 'pesto', label: 'Pesto', price: 4 },
    { value: 'bbq', label: 'BBQ', price: 5 },
  ],
}

renderIngredients()

ingredientList.onchange = handleUnlist
ingredientsPane.onchange = handleChange

function renderIngredients() {
  const names = Object.keys(ingredients)
  
  for (let i = 0; i < 4; i++) {
    const name = names[i]
    const list = ingredientLists[i]
    const type = i && i < 3 ? 'checkbox' : 'radio'
    const items = ingredients[name].map(buildItem(name, type))

    list.replaceChildren(...items)
  }
}

function buildItem(name, type) {
  return ({ value, label: text, price }) => {
    const item = document.createElement('li')
    const label = document.createElement('label')
    const input = document.createElement('input')
    const labelSpan = document.createElement('span')
    const priceSpan = document.createElement('span')
    
    input.type = type
    input.name = name
    input.value = value
    priceSpan.className = 'price'
    
    labelSpan.append(text)
    priceSpan.append(price)
    label.append(input, labelSpan, priceSpan)
    item.append(label)
    
    return item
  }
}

function handleUnlist(e) {
  const box = e.target
  const item = box.closest('li')
  const value = box.value
  
  uncheckIngredient(value)
  
  item.remove()

  updatePrice()
  updatePizzaView()
}

function handleChange(e) {
  const input = e.target

  if (input.type == 'radio') handleRadio(e)
  else handleCheckbox(e)

  sortIngredients()
  updatePrice()
  updatePizzaView()
}

function handleRadio(e) {
  const radio = e.target
  const item = radio.closest('li')
  const name = radio.name
  
  removeSelected(name)
  addSelected(item)
}

function handleCheckbox(e) {
  const box = e.target
  const boxList = box.closest('ul')
  const selectedBoxes = boxList.querySelectorAll(':checked')
  const item = box.closest('li')
  const value = box.value
  const name = box.name
  const moreAvailable = selectedBoxes.length < 2
  
  if (box.checked) addSelected(item)
  else removeSelected(name, value)

  toggleBoxes(name, moreAvailable)
}

function uncheckIngredient(value) {
  const selector = `[value="${value}"]`
  const box = ingredientsPane.querySelector(selector)
  const name = box.name

  box.checked = false

  toggleBoxes(name, true)
}

function addSelected(item) {
  const ingredientItem = item.cloneNode(true)
  const input = ingredientItem.querySelector('input')

  input.type = 'checkbox'
  ingredientItem.checked = true
  
  ingredientList.append(ingredientItem)
}

function removeSelected(name, value) {
  let selector = `li:has([name="${name}"])`

  // if (value) selector.replace(')', `[value="${value}"])`)
  if (value) selector += `:has([value="${value}"])`

  const item = ingredientList.querySelector(selector)
  
  item?.remove()
  // if (item) item.remove()
}

function toggleBoxes(name, enabled) {
  const selector = `[name="${name}"]:not(:checked)`
  const boxes = ingredientsPane.querySelectorAll(selector)

  boxes.forEach(box => box.disabled = !enabled)
}

function sortIngredients() {
  const order = ['base', 'ingredient1', 'ingredient2', 'sauce']
  const items = Array.from(ingredientList.querySelectorAll('li'))

  items.sort((a, b) => {
    const aName = a.querySelector('input').name
    const bName = b.querySelector('input').name
    const aIndex = order.indexOf(aName)
    const bIndex = order.indexOf(bName)

    return aIndex - bIndex
  })

  ingredientList.append(...items)
}

function updatePrice() {
  const items = Array.from(ingredientList.querySelectorAll('li'))
  const price = items.reduce((sum, item) => {
    const priceTag = item.querySelector('.price')
    const price = +priceTag.textContent
    
    return sum + price
  }, 0)

  priceOut.textContent = price
}

function updatePizzaView() {
  const selector = 'ul:has(:checked)'
  const checkedLists = ingredientsPane.querySelectorAll(selector)
  const progress = checkedLists.length
  const ready = progress == 4

  for (let i = 0; i < 4; i++) {
    const quarter = quarters[i]

    quarter.hidden = i >= progress
  }
  
  orderBtn.hidden = !ready
}
