const url = 'https://bsales-api.herokuapp.com/api',
  filters = {},
  products = document.getElementById('products'),
  cardProduct = document.getElementById('template-card').content,
  fragmentCard = document.createDocumentFragment(),
  categories = document.getElementById('categories'),
  category = document.getElementById('template-category').content,
  fragmentCategory = document.createDocumentFragment();
const buttonSearch = document.getElementById('buttonSearch'),
  inputSearch = document.getElementById('inputSearch'),
  minPrice = document.getElementById('minPrice'),
  maxPrice = document.getElementById('maxPrice'),
  minDisc = document.getElementById('minDisc'),
  maxDisc = document.getElementById('maxDisc');

document.addEventListener('DOMContentLoaded', async () => {
  addProduct(await getProducts());
  addCategory(await getCategories());
});

const getProducts = async () => {
  try {
    const res = await axios.post(`${url}/products`, filters);
    return res.data;
  } catch (error) {
    alert(`${error?.response?.data}`);
    console.log('Error: ', error?.response?.data);
  }
};
const getCategories = async () => {
  try {
    const res = await axios(`${url}/categories`);
    return res.data;
  } catch (error) {
    alert(`${error?.response?.data}`);
    console.log('Error: ', error?.response?.data);
  }
};

const addProduct = (data) => {
  if (!data?.length) return;

  Array.isArray(data) &&
    data?.forEach((p) => {
      cardProduct
        .querySelector('img')
        .setAttribute(
          'src',
          p.url_image
            ? p.url_image
            : 'https://bitzen.cl/49-medium_default/bsale.jpg'
        );
      cardProduct.querySelector('span').textContent = p.discount
        ? `${p.discount}% off`
        : '';
      cardProduct.querySelector('h6').textContent = p.name;
      cardProduct.querySelector('p').textContent = p.discount
        ? `$${p.price} now: $${(p.price * (100 - p.discount)) / 100}`
        : `$${p.price}`;

      const clone = cardProduct.cloneNode(true);
      fragmentCard.appendChild(clone);
    });
  products.appendChild(fragmentCard);
};
const addCategory = (data) => {
  data?.map((p) => {
    category.querySelector('p').textContent = p.name;
    category.querySelector('input').setAttribute('id', `cat${p.id}`);

    const clone = category.cloneNode(true);
    fragmentCategory.appendChild(clone);
  });
  categories.appendChild(fragmentCategory);
};

// Filters
buttonSearch.addEventListener('click', (e) => {
  e.preventDefault();
  filters.name = inputSearch.value;
  updateCards();
});
categories.addEventListener('click', (e) => {
  if (!filters.category) filters.category = [];
  if (e.target.classList.contains('checkbox')) {
    document
      .getElementById(e.target.id)
      .setAttribute('value', e.target.value == 0 ? 1 : 0);
    if (e.target.value == 1) addCategoryToFilters(e.target.id[3]);
    if (e.target.value == 0) removeCategoryToFilters(e.target.id[3]);
  }
});
minPrice.addEventListener('change', (e) => {
  filters.pMin = e.target.value;
});
maxPrice.addEventListener('change', (e) => {
  filters.pMax = e.target.value;
});
minDisc.addEventListener('change', (e) => {
  filters.dMin = e.target.value;
});
maxDisc.addEventListener('change', (e) => {
  filters.dMax = e.target.value;
});

const updateCards = async () => {
  products.innerHTML = '';
  addProduct(await getProducts());
};
const addCategoryToFilters = (id) => {
  if (!filters.category?.includes(id)) filters.category.push(id);
};
const removeCategoryToFilters = (id) => {
  filters.category = filters.category?.filter((e) => e !== id);
};
