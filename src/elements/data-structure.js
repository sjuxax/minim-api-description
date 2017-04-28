export default function (namespace) {
  class DataStructure extends namespace.BaseElement {
    constructor(...args) {
      super(...args);
      this.element = 'dataStructure';

      if (this.content !== undefined) {
        this.content = namespace.toElement(this.content);
      }
    }

    toValue() {
      let get_content = (t) => {
        let c = t.content;

        if (c === undefined)
          return `<?${t._storedElement}>`

        if ((t.element == 'dataStructure' ||
            t.toValue === undefined ||
            t.element == 'array'
            ) && Array.isArray(c)) {
          return (c.map((item) => {
              return get_content(item)
          }));
        }

        if (t.element == 'object' || t.element == 'enum')
          c = t
        return {structure: c.toValue(), id: (c.id.toValue() ? c.id.toValue() : '?')}
      }

      return get_content(this)
    }

    toRefract() {
      const refract = super.toRefract();

      if (Array.isArray(this.content)) {
        refract.content = this.content.map(item => item.toRefract());
      } else {
        refract.content = this.content.toRefract();
      }

      return refract;
    }

    fromRefract(doc) {
      super.fromRefract(doc);

      if (Array.isArray(doc.content)) {
        this.content = doc.content.map(item => namespace.fromRefract(item));
      } else {
        this.content = namespace.fromRefract(doc.content);
      }

      return this;
    }
  }

  namespace.register('dataStructure', DataStructure);
}
