export default function searchPeople() {
  return {
    query: "",
    pagefind: null,
    error: null,
    isLoading: false,
    results: null,
    resultCount: 0,

    async init() {
      let pagefind;
      try {
        pagefind = await import("/pagefind/pagefind.js");
        pagefind.init();
      } catch (e) {
        this.error = e;
        return;
      }
      this.pagefind = pagefind;
      this.$watch("query", (val) => this.search(val));
    },

    async search(query) {
      this.isLoading = true;
      this.resultCount = 0;
      let results;
      try {
        const search = await this.pagefind.debouncedSearch(query);
        if (search === null) return;
        results = await Promise.all(
          search.results.slice(0, 20).map((r) => r.data()),
        );
        this.resultCount = search.results.length;
      } catch (e) {
        this.resultCount = 0;
        this.error = e;
        this.isLoading = false;
        return;
      }
      this.results = results;
      this.isLoading = false;
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

      return this.results.map((data) => ({
        id: data.url,
        url: data.url,
        name: data.meta.title,
        excerpt: data.excerpt,
        organization: data.meta.organization || "",
        role: data.meta.role || "",
        beat: data.filters.beat || [],
        expertise: data.filters.expertise || [],
        location: data.filters.location || [],
        area: data.filters.area || [],
        image: data.meta.image,
        alt: data.meta.image_alt,
        srcset: data.meta.image_srcset,
        width: data.meta.image_width,
        height: data.meta.image_height,
      }));
    },

    get resultsText() {
      if (this.isLoading || !this.query || !this.results) return "";

      let total = this.resultCount;
      let shown = this.results.length;

      if (total < 1) {
        return "No search results.";
      }
      if (total === 1) {
        return "Got one search result.";
      }
      let more = total > shown ? `Showing first ${shown} results.` : "";
      return `Got ${total} search results. ${more}`;
    },

    andMore(a) {
      if (a.length > 3) {
        return a.slice(0, 2).join(", ") + " and more";
      }
      return a.join(", ");
    },
  };
}
