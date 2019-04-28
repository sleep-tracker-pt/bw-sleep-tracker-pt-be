const blogPosts = require("../../helpers/helpers.js").blogPosts;

module.exports = server => {
  server.get("/api/blogPosts", blogPosts);
};

// this.state.blogUrls.forEach(url =>
//   axios
//     .get(`https://api.rss2json.com/v1/api.json?rss_url=${url}`)
//     .then(response => {
//       let strippedBody = stripHtml(response.data.items[0].content);
//       let newPost = {
//         title: response.data.items[0].title,
//         author: response.data.items[0].author,
//         body: strippedBody.substring(0, 150),
//         pubDate: response.data.items[0].pubDate,
//         thumbnailUrl: response.data.items[0].thumbnail,
//         linkUrl: response.data.items[0].link
//       };
//       this.setState({ blogPosts: [...this.state.blogPosts, newPost] });
//     })
//     .catch(error => console.log(error))
// );
