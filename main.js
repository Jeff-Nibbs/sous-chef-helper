const apiKey = '048cc2692d504ca280dcf8c134d096c7';
const url = 'https://api.spoonacular.com/recipes';
const numOfRecipes = '40';
const isVisible = 'is-visible';
const modalOpen = '[data-open]';
const modalOpenRecipe = '[data-openr]';
const modalClose = '[data-close]';
const foodButtons = document.querySelectorAll('.recipe-btn');
const sortButtons = document.querySelectorAll('.sort-btn');
const grid = document.getElementById('grid');
const main = document.getElementById('main');
const favorites = document.getElementById('favorites');
const favGrid = document.getElementById('favGrid');
const openModal = document.querySelectorAll(modalOpen);
const closeModal = document.querySelectorAll(modalClose);
const apiList = [];

// Food Buttons
for (const button of foodButtons) {
  button.addEventListener('click', () => {
    let typeOfFood = button.innerText;
    fetchApi(typeOfFood);
  });
}

// Sorting Buttons
for (const button of sortButtons) {
  button.addEventListener('click', () => {
    if (button.innerText === 'A - Z') {
      sortAZ();
    }
    if (button.innerText === 'Z - A') {
      sortZA();
    }
  });
}

// First Api Fetch
function fetchApi (food) {
  const recipes = fetch(`${url}/complexSearch?apiKey=${apiKey}&number=${numOfRecipes}&query=${food}`);
  recipes
  .then((data) => data.json())
  .then((response) => response.results)
  .then((results) => {
    apiList.length = 0;
    holdApi(results);
  })
  .catch((err) => console.log(err));
}

// Api Recipes Fetch
function fetchRecipes (idNum) {
  const recipes = fetch(`${url}/${idNum}/information?apiKey=${apiKey}`);
  recipes
  .then((data) => data.json())
  .then((response) => {
    makeRecipeModal(response);
  })
  .catch((err) => console.log(err));
}


// Creates Api Array
function holdApi(results) {
  for (let apiData of results) {
    apiList.push(apiData);
  }
  makeCards(apiList);
}



// Makes Div Cards and Adds Event Listener
function makeCards(data) {
  if (grid.hasChildNodes()) {
    eraseOldFetch(grid);
  }
  for (let recipe of data) {
    const card = document.createElement('div');
    const imgs = document.createElement('img');
    const box = document.createElement('div');
    const h3s = document.createElement('h3');
    const favButton = document.createElement('i');

    card.className = 'recipe-card';
    box.className = 'card-popup-box';
    h3s.className = 'food-name';
    favButton.className = 'fa-solid fa-plus fav-btn';


    imgs.setAttribute('src', recipe.image);
    imgs.setAttribute('alt', 'food icon');
    box.setAttribute('data-openr', recipe.id)
    
    h3s.innerHTML = recipe.title;

    box.appendChild(h3s);
    card.appendChild(favButton);
    card.appendChild(imgs);
    card.appendChild(box);
    
    grid.appendChild(card);
  }
  // Get Recipe
  const openRecipeModal = document.querySelectorAll(modalOpenRecipe);
  for(const elm of openRecipeModal) {
    elm.addEventListener('click', function(){
      const idNumber = this.dataset.openr;
      fetchRecipes(idNumber);
    })
  }

  // Move from Grid to Favorites
  const favoriteButtons = document.querySelectorAll('.fav-btn');
  for(const elm of favoriteButtons) {
    elm.addEventListener('click', function(){
      if (this.parentElement.parentElement === grid) {
        favGrid.appendChild(this.parentElement);
      } else if (this.parentElement.parentElement === favGrid) {
        grid.appendChild(this.parentElement);
      }
    })
  }
} 



// Sort Recipe-grid
function sortAZ() {

  let gridChildren = document.getElementById('grid').children;
  gridChildren = Array.prototype.slice.call(gridChildren);
  let favGridChildren = document.getElementById('favGrid').children;
  favGridChildren = Array.prototype.slice.call(favGridChildren);

  gridChildren.sort(function(a, b) {
    const nameA = a.lastChild.firstChild.innerHTML.toUpperCase();
    const nameB = b.lastChild.firstChild.innerHTML.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  favGridChildren.sort(function(a, b) {
    const nameA = a.lastChild.firstChild.innerHTML.toUpperCase();
    const nameB = b.lastChild.firstChild.innerHTML.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  for(var i = 0, len = gridChildren.length; i < len; i++) {
    var parent = gridChildren[i].parentNode;
    var detachedItem = parent.removeChild(gridChildren[i]);
    parent.appendChild(detachedItem);
  }

  for(var i = 0, len = favGridChildren.length; i < len; i++) {
    var parent = favGridChildren[i].parentNode;
    var detachedItem = parent.removeChild(favGridChildren[i]);
    parent.appendChild(detachedItem);
  }

}


function sortZA() {

  let gridChildren = document.getElementById('grid').children;
  gridChildren = Array.prototype.slice.call(gridChildren);
  let favGridChildren = document.getElementById('favGrid').children;
  favGridChildren = Array.prototype.slice.call(favGridChildren);

  gridChildren.sort(function(a, b) {
    const nameA = a.lastChild.firstChild.innerHTML.toUpperCase();
    const nameB = b.lastChild.firstChild.innerHTML.toUpperCase();
    if (nameA < nameB) {
      return 1;
    }
    if (nameA > nameB) {
      return -1;
    }
    return 0;
  });

  favGridChildren.sort(function(a, b) {
    const nameA = a.lastChild.firstChild.innerHTML.toUpperCase();
    const nameB = b.lastChild.firstChild.innerHTML.toUpperCase();
    if (nameA < nameB) {
      return 1;
    }
    if (nameA > nameB) {
      return -1;
    }
    return 0;
  });

  for(var i = 0, len = gridChildren.length; i < len; i++) {
    var parent = gridChildren[i].parentNode;
    var detachedItem = parent.removeChild(gridChildren[i]);
    parent.appendChild(detachedItem);
  }

  for(var i = 0, len = favGridChildren.length; i < len; i++) {
    var parent = favGridChildren[i].parentNode;
    var detachedItem = parent.removeChild(favGridChildren[i]);
    parent.appendChild(detachedItem);
  }

}

// Open Modals
for (const elm of openModal) {
  elm.addEventListener('click', function() {
    const modalId = this.dataset.open;
    document.getElementById(modalId).classList.add(isVisible);
  })
}

// Close Modals
for (const elm of closeModal) {
  elm.addEventListener('click', function() {
    this.parentElement.classList.remove(isVisible);
  })
}
document.addEventListener('keyup', (e) => {
  if (e.key === 'Escape') {
    document.querySelector('.modal.is-visible').classList.remove(isVisible);
  }
})

// Recipe Modal Creator
function makeRecipeModal(apiInfo) {
  const divTop = document.createElement('div');
  const divPic = document.createElement('div');
  const divPicText = document.createElement('div');
  const icon = document.createElement('i');
  const header = document.createElement('h2');
  const img = document.createElement('img');
  const summaryHeader = document.createElement('h3');
  const divSummary = document.createElement('div');
  const instructionsHeader = document.createElement('h3')
  const divInstructions = document.createElement('div');


  divTop.className = 'modal recipe-box-modal';
  divPic.className = 'summary-box';
  img.className = 'modal-pic';
  icon.className = 'fas fa-times place';
  header.className = 'header-lg center';
  
  divTop.setAttribute('data-animation', 'zoomInOut');
  divTop.setAttribute('id', apiInfo.id);
  img.setAttribute('src', apiInfo.image);
  img.setAttribute('alt', 'food icon');
  icon.setAttribute('data-close', '');

  header.innerHTML = apiInfo.title;
  summaryHeader.innerHTML = 'Summary';
  divSummary.innerHTML = apiInfo.summary;
  instructionsHeader.innerHTML = 'Instructions';
  divInstructions.innerHTML = apiInfo.instructions;

  divTop.appendChild(icon);
  divTop.appendChild(header);
  divTop.appendChild(divPic);
  divPic.appendChild(img);
  divPic.appendChild(divPicText);
  divPicText.appendChild(summaryHeader);
  divPicText.appendChild(divSummary);
  divTop.appendChild(instructionsHeader);
  divTop.appendChild(divInstructions);
  main.appendChild(divTop);

  document.getElementById(apiInfo.id).classList.add(isVisible);

  const closeModal = document.querySelectorAll(modalClose);
  for (const elm of closeModal) {
    elm.addEventListener('click', function() {
      this.parentElement.classList.remove(isVisible);
    })
  }
}


// Clears out recipe-grid
function eraseOldFetch(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}