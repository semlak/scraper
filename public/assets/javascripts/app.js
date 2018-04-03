let submitNewNote = data => {
  $.post("/notes", data).then(response => {
    console.log(response);
  }).catch(err => console.log(err))
}

$(document).on("click", ".new-note", event => {
  let button = event.currentTarget;
  let formTextArea = $(button).parent().find("textarea");
  let noteBody = formTextArea.val().trim();
  // console.log("noteBody", noteBody);
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

