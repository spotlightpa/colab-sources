export default function comboBox() {
  return {
    xmodel: "",
    query: "",
    options: [],
    init() {
      this.xmodel = this.$el.dataset.xmodel;
      let opts = this.$refs.options.querySelectorAll("option");
      this.options = Array.from(opts).map((opt, i) => ({
        id: i,
        name: opt.innerText,
        value: opt.value,
        disabled: opt.disabled,
      }));
    },
    get selected() {
      return this[this.xmodel];
    },
    set selected(val) {
      this[this.xmodel] = val;
    },
    get filteredOptions() {
      return this.query === ""
        ? this.options
        : this.options.filter((framework) => {
            return framework.name
              .toLowerCase()
              .includes(this.query.toLowerCase());
          });
    },
    remove(item) {
      this.selected = this.selected.filter((i) => i !== item);
    },
  };
}
