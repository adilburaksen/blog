const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");

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

  eleventyConfig.addFilter("date", function (date, format) {
    return DateTime.fromJSDate(date).toFormat(format);
  });

  eleventyConfig.addFilter("dateDisplay", function (date) {
    return DateTime.fromJSDate(date).toFormat('dd LLL yyyy');
  });

  eleventyConfig.addWatchTarget("./css/");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      layouts: "_includes"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};