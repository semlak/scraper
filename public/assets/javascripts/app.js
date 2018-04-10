let submitNewNote = data => {
  $.post("/notes", data).then(response => {
    // console.log(response);
    location.href=location.href;
  }).catch(err => console.log(err))
}

let setArticleSaveStatus = (id, isSaved) => {
  $.ajax({
    url: `/headlines/${id}`, 
    method: 'PUT', 
    data: {isSaved},
  }).then(response => {
    console.log(response);
    location.href=location.href;
  })
}

$(document).on("click", '.save-article', event => {
  console.log("heard click")
  let button = event.currentTarget;
  const articleId = $(button).data('articleId');
  setArticleSaveStatus(articleId, true);
})

$(document).on("click", '.remove-save-article', event => {
  console.log("heard click")
  let button = event.currentTarget;
  const articleId = $(button).data('articleId');
  setArticleSaveStatus(articleId, false);
})


$(document).on("click", '#rescrape' , event=> {
  event.preventDefault();
  $.get("/scraper").then(response => {
    location.href=location.href;
  }).catch(err => {
    UIkit.modal.alert("Error while re-scraping articles.")
  })
})

$(document).on("click", ".new-note", event => {
  event.preventDefault();
  let button = event.currentTarget;
  let formTextArea = $(button).parent().find("textarea");
  let noteBody = formTextArea.val().trim();
  // console.log("noteBody", noteBody);
  if (noteBody.length < 1) {
    // return UIkit.notification({status: "warning", message: "Submitted comments cannot be empty strings."})
    return UIkit.modal.alert("Submitted comments cannot be empty strings.")

  }
  let noteData = {
    body: noteBody,
    articleId: $(button).data('articleId'),
    userId: null
  }
  formTextArea.val("");
  // console.log("noteData", noteData);
  submitNewNote(noteData)

})

$(document).on("load", () => {
})

