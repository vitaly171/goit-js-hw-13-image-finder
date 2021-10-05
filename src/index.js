import './sass/main.scss';

import LoadMore from './js/load-more';
import API from './js/api';
import cardMarkup from './templates/cardTpl.hbs';
import alert from './js/pnotify';
import { defaults } from '@pnotify/core';
defaults.width = '400px';


const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
};

const loadMore = new LoadMore({
    selector: '[data-action="load-more"]',
    hidden: true, 
});


const imgApi = new API();

refs.searchForm.addEventListener('submit', onSearch);
loadMore.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
    e.preventDefault();
    
    clearGalleryContainer();
    imgApi.query = e.currentTarget.query.value;

    if (imgApi.query === '') {
        loadMore.disable();
    }


    loadMore.show();
    imgApi.resetPage();
    fetchCards();
}

function fetchCards() {
    loadMore.disable();
    return imgApi.fetchImage().then(cards => {
        renderMarkup(cards);

        scrollPage();
        loadMore.enable();

        if (cards.length === 0) {
           loadMore.hide();
    /*refs.gallery.innerHTML = ''
            throw alert({ text: 'Что-то пошло не так, проверь правильность ввода данных!' })*/
        }
    });
}

function onLoadMore() {
  fetchCards()
}




function renderMarkup(hits) {
    refs.gallery.insertAdjacentHTML('beforeend', cardMarkup(hits));
}

function clearGalleryContainer() {
    refs.gallery.innerHTML = '';
}

function scrollPage() {
  try {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }, 1000);
  } catch (error) {
    console.log(error);
  }
}
