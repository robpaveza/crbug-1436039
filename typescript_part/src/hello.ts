function helloWorld() {
  const div = document.createElement('div');
  div.textContent = 'Hello, world - posted ' + new Date().toString();
  document.querySelector('body')!.appendChild(div);
}
