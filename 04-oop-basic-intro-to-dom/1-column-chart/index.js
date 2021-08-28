export default class ColumnChart {
  element;
  subElements = {};
  chartHeight = 50;

  constructor({ data = [], label = '', value = 0, formatHeading = data => data, link = '' } = {}) {
    this.data = data;
    this.label = label;
    this.value = formatHeading(value);
    this.link = link;

    this.render();
  }

  getLink() {
    return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
  }

  getColumnBody(data) {
    if (data.length === 0) return '';

    const maxValue = Math.max(...data);
    const proportion = this.chartHeight / maxValue;
    const arr = data.map((item) => {
      const value = Math.floor(item * proportion);
      const percent = (item / maxValue * 100).toFixed(0);
      return `<div style="--value: ${value}" data-tooltip="${percent}%"></div>`;
    });
    return arr.join('');
  }

  getTemplate() {
    return `
      <div class="column-chart column-chart_loading">
        <div class="column-chart__title">
            Total ${this.label}
            ${this.getLink()}
        </div>
        <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">${this.value}</div>
            <div data-element="body" class="column-chart__chart">
                ${this.getColumnBody(this.data)}
            </div>
        </div>
      </div>
    `;
  }

  getSubElements(element) {
    const elements = {};

    const subElements = element.querySelectorAll('[data-element]');

    for (const subElement of subElements) {
      elements[subElement.dataset.element] = subElement;
    }

    return elements;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate();

    this.element = element.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }

    this.subElements = this.getSubElements(this.element);

    this.element = element.firstElementChild;

  }

  update(data) {
    this.subElements.body.innerHTML = this.getColumnBody(data);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
  }
}
