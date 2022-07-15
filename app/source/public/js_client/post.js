$(document).ready( () => {
$.ajax({
    method: "post",
    url: document.location.href,
    headers: {
        "Content-Type": "application/json",
    },
}).then( (response) => {
    var content = response.data.content;
    $(".post_content").html(`${content}`)
}).catch(err => console.log(err))
})