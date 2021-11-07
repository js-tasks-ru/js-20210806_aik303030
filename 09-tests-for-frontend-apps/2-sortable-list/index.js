export default class SortableList {
  element;
  draggingElement;
  constructor({ items }) {
    this.items = items;
    this.render();
  }

  dispatchEvent (type, details) {
    this.element.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      details
    }));
  }

  getPlaceholder(height) {
    const placeholder = document.createElement('div');
    placeholder.classList.add('sortable-list__placeholder');
    placeholder.style.height = height + 'px';
    return placeholder;
  }

  onPointerDown = (e) => {
    if (e.target.dataset.grabHandle !== undefined) {

      this.draggingElement = e.target.closest('.sortable-list__item');
      const elementWidth = this.draggingElement.offsetWidth;
      const elementHeight = this.draggingElement.offsetHeight;

      const elementIndex = [...this.element.children].indexOf(this.draggingElement);

      const shiftY = e.clientY - this.draggingElement.offsetTop - this.element.offsetTop;
      const shiftX = e.clientX - this.draggingElement.offsetLeft - this.element.offsetLeft;

      this.draggingElement.classList.add('sortable-list__item_dragging');
      this.draggingElement.style.width = elementWidth + 'px';
      this.draggingElement.style.height = elementHeight + 'px';

      const placeholder = this.getPlaceholder(this.draggingElement.offsetHeight);

      this.draggingElement.after(placeholder);

      const onPointerMove = (e) => {
        const clientY = e.clientY - this.element.offsetTop - shiftY;
        const clientX = e.clientX - this.element.offsetLeft - shiftX;
        this.element.append(this.draggingElement);
        this.draggingElement.style.top = clientY + 'px';
        this.draggingElement.style.left = clientX + 'px';

        const prevElem = placeholder.previousElementSibling;
        const nextElem = placeholder.nextElementSibling;

        const { firstElementChild, lastElementChild } = this.element;
        const { top: firstElementTop } = firstElementChild.getBoundingClientRect();
        const { bottom } = this.element.getBoundingClientRect();

        if (clientY < firstElementTop) {
          return firstElementChild.before(placeholder);
        }

        if (clientY > bottom) {
          return lastElementChild.after(placeholder);
        }

        if (prevElem) {
          const { top, height } = prevElem.getBoundingClientRect();
          const middlePrevElem = top + height / 2;

          if (clientY < middlePrevElem) {
            return prevElem.before(placeholder);
          }
        }

        if (nextElem) {
          const { top, height } = nextElem.getBoundingClientRect();
          const middleNextElem = top + height / 2;

          if (clientY > middleNextElem) {
            return nextElem.after(placeholder);
          }
        }

        const scrollingValue = 10;
        const threshold = 20;

        if (clientY < threshold) {
          window.scrollBy(0, -scrollingValue);
        } else if (clientY > document.documentElement.clientHeight - threshold) {
          window.scrollBy(0, scrollingValue);
        }
      };

      const onPointerUp = () => {
        const placeholderIndex = [...this.element.children].indexOf(placeholder);
        this.draggingElement.style.cssText = '';
        this.draggingElement.classList.remove('sortable-list__item_dragging');
        placeholder.replaceWith(this.draggingElement);
        this.draggingElement = null;
        document.removeEventListener('mousemove', onPointerMove);

        if (placeholderIndex !== elementIndex) {
          this.dispatchEvent('sortable-list-reorder', {
            from: elementIndex,
            to: placeholderIndex,
          });
        }
      };

      document.addEventListener('mousemove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    }
    if (e.target.dataset.deleteHandle !== undefined) {
      e.target.closest('.sortable-list__item').remove();
    }
  }

  addEventListeners() {
    document.addEventListener('pointerdown', this.onPointerDown);
  }

  render() {
    this.element = document.createElement('ul');
    this.element.classList.add('sortable-list');
    this.items.forEach((item) => {
      item.classList.add('sortable-list__item');
      this.element.append(item);
    });

    this.addEventListeners();
  }

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy () {
    this.remove();
    document.removeEventListener('pointerdown', this.onPointerDown);
    this.element = null;
  }

}
