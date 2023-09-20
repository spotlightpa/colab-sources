export default function comboBox() {
  return {
    query: "",
    selected: [],
    options: [],
    init() {
      let opts = this.$refs.options.querySelectorAll("option");
      this.options = Array.from(opts).map((opt, i) => ({
        id: i,
        name: opt.innerText,
        disabled: opt.disabled,
      }));
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
    remove(framework) {
      this.selected = this.selected.filter((i) => i !== framework);
    },
  };
}
