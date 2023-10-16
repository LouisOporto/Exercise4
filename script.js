// https://jsonplaceholder.typicode.com/guide/

async function downloadPosts(page = 1) {
  const postsURL = `https://jsonplaceholder.typicode.com/posts?_page=${page}`;
  const response = await fetch(postsURL);
  const articles = await response.json();
  return articles;
}

async function downloadComments(postId) {
  const commentsURL = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
  const response = await fetch(commentsURL);
  const comments = await response.json();
  return comments;
}

async function getUserName(userId) {
  const userURL = `https://jsonplaceholder.typicode.com/users/${userId}`;
  const response = await fetch(userURL);
  const user = await response.json();
  return user.name;
}

function getArticleId(comments) {
  const article = comments.previousElementSibling;
  const data = article.dataset;
  return data.postId;
}
// articles need to be downloaded first before adding event listeners to
const posts = await downloadPosts(5);
console.log(posts);
let main = document.querySelector("main");
for (let post of posts) {
  let text = post.body.replaceAll(/\n/g, "<br />");
  let author = await getUserName(post.userId); // await allow for function to get author name while it access the API url
  main.innerHTML += `<article data-post-id="${post.id}"><h2>${post.title}</h2><aside>by <span class="author">${author}</span></aside><p>${text}</p></article>`;
  /* Adding articles to html
    <article>
        <h2></h2>
        <aside>by <span class="author"></span></aside>
        <p></p>
    </article>
  */
  main.innerHTML += `<details><summary>See what our readers had to say...</summary><section><header><h3>Comments</h3></header></section></details>`;
  /* Adding details next without <asides> (eventlistener will do the hard work)
    <details>
      <summary>See what our readers had to say...</summary>
      <section>
          <header>
              <h3>Comments</h3>
          </header>
      </section>
    </details>
  */
}
// End of added code
const details = document.getElementsByTagName("details");
for (const detail of details) {
  detail.addEventListener("toggle", async (event) => {
    if (detail.open) {
      const asides = detail.getElementsByTagName("aside");
      const commentsWereDownloaded = asides.length > 0;
      if (!commentsWereDownloaded) {
        const articleId = getArticleId(detail);
        const comments = await downloadComments(articleId);
        // Start below for code to add asides to the inside section
        const section = detail.getElementsByTagName("section");
        for (let comment of comments) {
          let text = comment.body.replaceAll(/\n/g, "<br />");
          section.item(0).innerHTML += `<aside><p>${text}</p><p><small>${comment.name}</small></p></aside>`
        }
        // End of added code
        console.log(comments);
      }
    }
  });
}
