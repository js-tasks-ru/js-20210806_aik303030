export default class SortableTable {
  element;
  subElements = {};
  latestOrder = 'asc';

  constructor(headerConfig = [], {
    data = [],
    sorted = {}
  } = {}) {
    this.data = Array.isArray(data) ? data : data.data;
    this.headerConfig = headerConfig;
    const { id, order } = sorted;
    this.id = id;
    this.order = order;

    this.render();
  }

  getHeaderCells(data) {
    return data.map((config) => {
      return `
        <div class="sortable-table__cell" data-id=${config.id} data-sortable=${config.sortable}>
            <span>${config.title}</span>
            <span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
            </span>
        </div>
      `;
    }).join('');
  }

  getHeader() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.getHeaderCells(this.headerConfig)}
      </div>
    `;
  }

  getBodyRow(item) {
    const cells = this.headerConfig.map(({id, template}) => {
      return {
        id,
        template,
      };
    });

    return cells.map(({id, template}) => {
      return template
        ? template(item[id])
        : `
          <div class="sortable-table__cell">
            ${item[id]}
          </div>
          `;
    }).join('');
  }

  getBodyRows(data) {
    return data.map((item) => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.getBodyRow(item)}
        </a>
      `;
    }).join('');
  }

  getBody() {
    return `
      <div data-element="body" class="sortable-table__body">
      ${this.getBodyRows(this.data)}
      </div>
    `;
  }

  getTemplate() {
    return `
        <div class="sortable-table">
            ${this.getHeader()}
            ${this.getBody()}
        </div>
    `;
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find((item) => item.id === field);
    const { sortType } = column;
    const directions = {
      'asc': 1,
      'desc': -1,
    };

    const direction = directions[order];

    arr.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[field] - b[field]);
        case 'string':
          return direction * a[field].localeCompare(b[field], ['ru', 'en']);
        default:
          return direction * (a[field] - b[field]);
      }
    });
    return arr;
  }

  getSubElements(element) {
    const elements = {};

    const subElements = element.querySelectorAll('[data-element]');

    for (const subElement of subElements) {
      elements[subElement.dataset.element] = subElement;
    }

    return elements;
  }

  changeOrder(order) {
    let newOrder;
    if (order === 'asc') newOrder = 'desc';
    if (order === 'desc') newOrder = 'asc';
    this.latestOrder = newOrder;
    return order;
  }

  sortListener = (e) => {
    e.preventDefault();
    const cell = e.target.closest('[data-id]');
    const { id } = cell.dataset;
    const newOrder = this.changeOrder(this.latestOrder);
    this.sort(id, newOrder);
  };

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate();

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);

    this.subElements.header.addEventListener('pointerdown', this.sortListener);

    this.sort(this.id, this.order);
  }

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    allColumns.forEach((column) => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.getBodyRows(sortedData);
  }

  remove() {
    if (this.subElements.header) {
      this.subElements.header.removeEventListener('pointerdown', this.sortListener);
    }
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

}
