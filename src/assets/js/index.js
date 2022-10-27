import utils from './utils/utils';

const quantityButtons = ['increase', 'decrease', 'delete'];

const openCloseMenu = () => {
	const sidebar = document.getElementById('sidebar');
	const isSidebarHided = !sidebar.style.display || sidebar.style.display === 'none';
	sidebar.style.display = isSidebarHided ? 'block' : 'none';
	sidebar.style.height = isSidebarHided ? '100%' : 'unset';
};

const removeStyleFromSidebar = e => {
	if (e.target.innerWidth >= 1200) {
		const sidebar = document.getElementById('sidebar');
		sidebar.removeAttribute('style');
	}
};

const addValueMap = {
	increase: 1,
	decrease: -1,
};

const changeAmount = type => e => {
	const basketItem = e.target.closest('.basket-item');
	const quantityElement = basketItem.querySelector('.basket-item__quantity');
	const oldQuantity = utils.getNumberFromElement(quantityElement);
	const addValue = type === 'delete' ? -oldQuantity : addValueMap[type] ?? 0;
	const newQuantity = oldQuantity + addValue;

	quantityElement.innerHTML = newQuantity.toLocaleString();
	const priceElement = basketItem.querySelector('.basket-item__price-numeric');
	const oldPrice = utils.getNumberFromElement(priceElement);
	const newPrice = (oldPrice / oldQuantity) * newQuantity;
	if (newPrice) {
		priceElement.innerHTML = newPrice.toLocaleString();
	}

	document.querySelectorAll('.checkout__item-recount').forEach(totalElement => {
		const oldTotal = utils.getNumberFromElement(totalElement);
		const newTotal = oldTotal + newPrice - oldPrice;
		totalElement.innerHTML = newTotal.toLocaleString();
	});
	if (!newQuantity) {
		basketItem.remove();
		const shopCounterElement = document.querySelector('.header__shop-counter');
		const oldValue = utils.getNumberFromElement(shopCounterElement);
		const newValue = oldValue - 1;
		shopCounterElement.innerHTML = newValue;
	}
};

class ProjectApp {
	constructor() {
		this.env = require('./utils/env').default;
		this.utils = require('./utils/utils').default;
		this.classes = {
			// Signal: require('./classes/Signal').default,
		};
		this.components = {};
		this.helpers = {};
		this.modules = {};
		document.addEventListener('DOMContentLoaded', () => {
			document.documentElement.classList.remove('_loading');

			document.querySelector('.header__icon-menu').addEventListener('click', openCloseMenu);
			window.addEventListener('resize', removeStyleFromSidebar);
			quantityButtons.forEach(type => {
				document.querySelectorAll(`.basket-item__quantity-button--${type}`).forEach(button => {
					button.addEventListener('click', changeAmount(type));
				});
			});
		});
	}
}

global.ProjectApp = new ProjectApp();

if (module.hot) {
	module.hot.accept();
	module.hot.dispose(() => {
		document.getElementById('.header__icon-menu').removeEventListener('click', openCloseMenu);
		window.removeEventListener('resize', removeStyleFromSidebar);
		quantityButtons.forEach(type => {
			document.querySelectorAll(`.basket-item__quantity-button--${type}`).forEach(button => {
				button.removeEventListener('click', changeAmount(type));
			});
		});
	});
}
