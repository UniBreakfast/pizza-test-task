const ingredientList = document.querySelector('.ingredients')
const ingredientsPane = document.querySelector('form>.ingredients')

ingredientsPane.onchange = handleChange

function handleChange(e) {
  const input = e.target

  if (input.type == 'radio') handleRadio(e)
  else handleCheckbox(e)

  sortIngredients()
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
  
  if (box.checked) addSelected(item)
  else removeSelected(name, value)

  if (selectedBoxes.length < 2) toggleBoxes(name, true)
  else toggleBoxes(name, false)
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

  if (value) selector.replace(')', `[value="${value}"])`)

  const item = ingredientList.querySelector(selector)
  
  item?.remove()
}

function toggleBoxes(name, enabled) {
  
}

function sortIngredients() {

}

function updatePizzaView() {

}
