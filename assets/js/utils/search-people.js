export default function searchPeople() {
  return {
    query: "",
    pagefind: null,
    error: null,
    isLoading: false,
    results: null,

    async init() {
      console.log("search people init");
      let pagefind;
      try {
        pagefind = await import("/pagefind/pagefind.js");
        pagefind.init();
      } catch (e) {
        this.error = e;
      }
      this.pagefind = pagefind;
      console.log("done pagefind init");
      this.$watch("query", (val) => this.search(val));
    },

    async search(val) {
      console.log("search", val);
      let query = val.trim();
      if (!query || !this.pagefind) {
        this.error = null;
        this.isLoading = false;
        this.result = null;
        return;
      }

      this.isLoading = true;
      let search, results;
      try {
        search = await this.pagefind.debouncedSearch(query);
        if (search === null) return;
        results = await Promise.all(
          search.results.slice(0, 5).map((r) => r.data()),
        );
      } catch (e) {
        this.error = e;
        this.isLoading = false;
        return;
      }
      this.results = results;
      this.isLoading = false;

      console.log("got results for", val);
    },

    clear() {
      this.query = "";
      this.isLoading = false;
      this.results = null;
      this.error = null;
    },

    get showClearButton() {
      if (this.isLoading) return false;
      return !!this.query.trim();
    },

    get people() {
      if (!this.results) return [];

      return this.results.map((r) => r.excerpt);
    },

    get resultsText() {
      return "";
    },
  };
}
