/** @typedef {import('./state.js').Show} Show */
import { notes, shows, watchlist } from './state.js';

/**
 * C1. Показує серіали в списку #results — по картці з шаблону #show-card на кожен, у тому
 * самому порядку, — і оновлює рядок статусу #status. Специфікація — ТЗ, C1.
 *
 * @param {readonly Show[]} list серіали, які треба показати
 */
export function renderShows(list) {
  const results = document.querySelector('#results');
  const template = document.querySelector('#show-card');
  const status = document.querySelector('#status');

  if (!(results instanceof HTMLUListElement)) throw new TypeError('Не знайдено список #results');
  if (!(template instanceof HTMLTemplateElement)) throw new TypeError('Не знайдено шаблон #show-card');
  if (!(status instanceof HTMLElement)) throw new TypeError('Не знайдено рядок статусу #status');

  const cards = list.map((show) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector('.card');
    if (!(card instanceof HTMLLIElement)) throw new TypeError('У шаблоні #show-card немає картки .card');

    card.dataset.id = String(show.id);
    for (const name of card.querySelectorAll('[data-field="name"]')) {
      name.textContent = show.name;
    }
    const year = card.querySelector('[data-field="year"]');
    const genres = card.querySelector('[data-field="genres"]');
    const rating = card.querySelector('[data-field="rating"]');
    if (!(year instanceof HTMLElement) || !(genres instanceof HTMLElement) || !(rating instanceof HTMLElement)) {
      throw new TypeError('У шаблоні #show-card бракує полів року, жанрів або оцінки');
    }

    year.textContent = show.year === null ? '—' : String(show.year);
    genres.textContent = show.genres.length ? show.genres.join(', ') : '—';
    rating.textContent = show.rating === null ? '—' : String(show.rating);

    const toggle = card.querySelector('[data-action="toggle"]');
    if (!(toggle instanceof HTMLButtonElement)) {
      throw new TypeError('У шаблоні #show-card немає кнопки [data-action="toggle"]');
    }
    toggle.setAttribute('aria-pressed', String(watchlist.has(show.id)));

    const note = notes.get(show.id);
    const myRating = card.querySelector('[data-field="my-rating"]');
    const mine = card.querySelector('.card__mine');
    const noteText = card.querySelector('[data-field="note"]');
    if (note && myRating instanceof HTMLElement && mine instanceof HTMLElement) {
      myRating.textContent = String(note.rating);
      mine.hidden = false;
    }
    if (note?.text && noteText instanceof HTMLElement) {
      noteText.textContent = note.text;
      noteText.hidden = false;
    }

    return fragment;
  });

  results.replaceChildren(...cards);
  status.textContent = list.length
    ? `Знайдено: ${list.length} з ${shows.length}`
    : 'Нічого не знайдено';
}
