// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('./sw.js').then(reg => {
//     console.log('[SW] Registered');
//   }).catch(function(error) {
//     console.log(`[SW] Registration failed: ${error}`);
//   });
// };

// STRUCTURE

/*
declare vars
Get data
write to screen all cards
add listeners
*/

// VARS
const teacherCache = localStorage;
const pinned = document.getElementById('pinned');
const classList = document.getElementById('class-list');
const search = document.getElementById('search');
let wordSearch = '';

// GET DATA
let outerData;

fetch('teacher-pages.json')
.then(resp => {
  data = resp.json()
  .then(data => {
    outerData = data;
    updateList(data);
    writePinned(data);
    addEventListeners();
  })
});

function writeToList(i, data) {
  let classRow = document.createElement('tr');
  let first = `<span><img src="/res/star-empty.svg" alt="Star" class="star" id="${i}"></span>`;
  classRow.className = 'class';
  // classRow.setAttribute('id', i);
  classRow.innerHTML = `${first}<td class="class-name">${data[i].class}</td><td class="teacher-name">${data[i].name}</td>`;
  classList.appendChild(classRow);
}

// Write ALL data to screen
function updateList(data, word) {
  if (word) {
    classList.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
      word = word.toLowerCase();
      let className = data[i].class.toLowerCase();
      let teacherName = data[i].name.toLowerCase();
      if (className.includes(word) || teacherName.includes(word)) {
        writeToList(i, data);
      }
    }
  } else {
    classList.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
      writeToList(i, data);
    }
  }
}

function writePinned(data) {
  if (teacherCache.length != 0) {
    for (let i = 0; i < teacherCache.length; i++) {
      let classRow = document.createElement('tr');
      let first = `<span><img src="/res/star-gold.svg" alt="Star" class="star" id="${i}"></span>`;
      classRow.className = 'class';
      classRow.innerHTML = `${first}<td class="class-name">${data[i].class}</td><td class="teacher-name">${data[i].name}</td>`;
      pinned.appendChild(classRow);
    }
  }
}

function updatePinned(id, data) {
  let classRow = document.createElement('tr');
  let first = `<span><img src="/res/star-gold.svg" alt="Star" class="star" id="${id}"></span>`;
  classRow.className = 'class';
  classRow.innerHTML = `${first}<td class="class-name">${data[id].class}</td><td class="teacher-name">${data[id].name}</td>`;
  pinned.appendChild(classRow);
}

function addEventListeners() {
  let stars = document.getElementsByClassName('star');

  for (let i = 0; i < stars.length; i++) {
    stars[i].addEventListener('click', evt => {
      let id = evt.path[0].id;
      evt.path[0].classList.add('pinned');
      console.log(evt.path[0].classList);
      teacherCache.setItem(id, id);
      updatePinned(id, outerData);
    });
  }
}

search.addEventListener('keyup', evt => {
  let keycode = evt.keyCode;
  let valid =
        (keycode > 47 && keycode < 58)   || // number keys
        (keycode == 32)                  || // spacebar & return key(s) (if you want to allow carriage returns)
        (keycode > 64 && keycode < 91)   || // letter keys
        (keycode > 95 && keycode < 112)  || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223);

  if (valid || keycode === 8) {
    if(keycode === 8) {
      wordSearch = wordSearch.substring(0, wordSearch.length - 1);
    } else {
      wordSearch += evt.key;
    }
    updateList(outerData, wordSearch);
  }
});
