const asyncSleep = async (ms = 100) => {
  return new Promise((r) => setTimeout(r, ms));
};

let currentSearchID = 0;

// See https://github.com/CloudCannon/pagefind/issues/441
async function debouncedSearch(
  pf,
  term,
  options = {},
  debounceTimeoutMs = 300,
) {
  const thisSearchID = ++currentSearchID;
  pf.preload(term, { ...options });
  await asyncSleep(debounceTimeoutMs);

  if (thisSearchID !== currentSearchID) {
    return null;
  }

  const searchResult = await pf.search(term, options);
  if (thisSearchID !== currentSearchID) {
    return null;
  }
  return searchResult;
}

export default function searchPeople() {
  return {
    filterType: "expert",
    filterExpertise: [],
    filterLocation: [],
    filterArea: [],
    filterBeat: [],
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
        await pagefind.options({ excerptLength: 10 });
        await pagefind.init();
      } catch (e) {
        this.error = e;
        return;
      }
      this.pagefind = pagefind;
      for (let param of [
        "query",
        "filterType",
        "filterArea",
        "filterExpertise",
        "filterLocation",
        "filterArea",
        "filterBeat",
      ]) {
        this.$watch(param, () => this.search());
      }
    },

    async search() {
      let query = this.query;
      // Don't wait for an empty search
      let timeout = this.query.trim() ? 300 : 0;
      this.isLoading = true;
      this.resultCount = 0;
      let options = {};
      let hasFilters = false;
      if (this.filterType) {
        options.filters = {
          type: this.filterType,
        };
        if (this.filterType === "expert") {
          options.filters.expertise = this.filterExpertise.map((f) => f.value);
          options.filters.location = this.filterLocation.map((f) => f.value);
          hasFilters =
            options.filters.expertise.length || options.filters.location.length;
        } else if (this.filterType === "journalist") {
          options.filters.area = this.filterArea.map((f) => f.value);
          options.filters.beat = this.filterBeat.map((f) => f.value);
          hasFilters =
            options.filters.area.length || options.filters.beat.length;
        }
      }
      if (hasFilters && !query) {
        query = null; // magic value for show all in category
      }

      let results;
      try {
        const search = await debouncedSearch(
          this.pagefind,
          query,
          options,
          timeout,
        );
        if (search === null) return;
        results = await Promise.all(search.results.map((r) => r.data()));
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
