// Utility function for creating a delay
const asyncSleep = async (ms = 100) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

let currentSearchID = 0;

// Debounced search function to prevent excessive API calls
// See https://github.com/CloudCannon/pagefind/issues/441
async function debouncedSearch(
  pf,
  term,
  options = {},
  debounceTimeoutMs = 300,
) {
  if (!options.filters.level) {
    delete options.filters.level;
  }
  if (options.filters && options.filters.type) {
    delete options.filters.type;
  }
  options.filters.relevantCourses = options.filters.relevantCourses.map(
    (course) => course.toLowerCase(),
  );
  options.filters.researchAreas = options.filters.researchAreas.map((area) =>
    area.toLowerCase(),
  );

  const thisSearchID = ++currentSearchID;
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
    filterType: "scientist",
    filterResearchAreas: [],
    filterRelevantCourses: [],
    filterLevel: [],
    query: "",
    pagefind: null,
    error: null,
    isLoading: false,
    results: null,
    resultCount: 0,

    // Initialize the search component
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
        "filterResearchAreas",
        "filterRelevantCourses",
        "filterLevel",
      ]) {
        this.$watch(param, () => this.search());
      }
    },

    // Perform the search
    async search() {
      let query = this.query.trim();
      let timeout = query ? 300 : 0;
      this.isLoading = true;
      this.resultCount = 0;
      let options = {};
      if (this.filterType) {
        options.filters = {
          type: this.filterType,
          researchAreas: this.filterResearchAreas.map((f) => f.value),
          relevantCourses: this.filterRelevantCourses.map((f) => f.value),
          level: this.filterLevel,
        };
      }

      if (this.hasFilters && !query) {
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

    // Clear the search results
    clear() {
      this.query = "";
      this.isLoading = false;
      this.results = null;
      this.error = null;
    },

    // Determine if the clear button should be shown
    get showClearButton() {
      if (this.isLoading) return false;
      return !!this.query.trim();
    },

    // Map search results to a usable format
    get people() {
      if (!this.results) return [];
      return this.results.map((data) => ({
        id: data.url,
        url: data.url,
        name: data.meta.title,
        excerpt: data.excerpt,
        role: data.meta.role || "",
        researchAreas: data.filters.researchAreas || [],
        relevantCourses: data.filters.relevantCourses || [],
        level: data.filters.level || [],
        image: data.meta.image,
        alt: data.meta.image_alt,
        srcset: data.meta.image_srcset,
        width: data.meta.image_width,
        height: data.meta.image_height,
      }));
    },

    // Check if any filters are applied
    get hasFilters() {
      return (
        this.filterResearchAreas.length > 0 ||
        this.filterRelevantCourses.length > 0 ||
        this.filterLevel.length > 0
      );
    },

    // Generate the results text
    get resultsText() {
      if (this.isLoading || !this.results) return "\u00a0";
      if (!this.query && !this.hasFilters) return "\u00a0";

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

    // Helper function to format arrays
    andMore(arr) {
      if (arr.length > 3) {
        return arr.slice(0, 2).join(", ") + " and more";
      }
      return arr.join(", ");
    },
  };
}
