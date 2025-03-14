module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./posts/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("tagList", function (collection) {
    const tagSet = new Set();
    collection.getAll().forEach(item => {
      if ("tags" in item.data) {
        let tags = item.data.tags;
        if (typeof tags === "string") {
          tags = [tags];
        }
        tags.forEach(tag => tagSet.add(tag));
      }
    });
    return [...tagSet];
  });

  eleventyConfig.addFilter("dateDisplay", function (dateObj) {
    return new Intl.DateTimeFormat("en-US").format(dateObj);
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};