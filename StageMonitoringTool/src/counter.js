export function setupCounter(element) {
  let counter = 0
  const h1 = document.querySelector('h1')
  
  const setCounter = (count) => {
    counter = count
    element.innerHTML = `Count is ${counter}`
    h1.innerHTML = `Count updated to ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}
