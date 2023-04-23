"use strict";
function helloWorld() {
    const div = document.createElement('div');
    div.textContent = 'Hello, world - posted ' + new Date().toString();
    document.querySelector('body').appendChild(div);
}
document.querySelector('#go').addEventListener('click', function (_e) {
    helloWorld();
});
//# sourceMappingURL=result.js.map