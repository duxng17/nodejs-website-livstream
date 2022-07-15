const socket = io("http://localhost:6060",{
  transports: ["websocket", "polling"]
});
// const socket = io("https://xembong365.com",{
//   transports: ["websocket", "polling"]
// });
socket.on("connect_error", () => {
  // revert to classic upgrade
  socket.io.opts.transports = ["polling", "websocket"];
});
socket.on("sever-send-data", (data) => {
  $(".chat_box").append(`
        <span class="chat_item mt-3 d-flex flex-nowrap" style="font-size: 12px;">
            <img src="${data.avt}" alt="anh-dai-dien-cua${data.username}" class=" me-1 logo chat_item-avt">
                <p class="mb-0 text-justify ms-2 ${data.role}">
                    <span class="chat_text-name">${data.username}</span>
                    <span class="mx-1"> : </span>
                    <span class="chat_text-content">${data.content}</span>
                </p>
        </span>
    `);
});
$(document).ready(function () {
  if (localStorage.getItem("avt_xembong365") === null) {
    localStorage.setItem("avt_xembong365", "/img/avt.jpg");
  }
  $(".btn_chat-content").click(() => {
    $(".chat_box").animate({ scrollTop: 20000000 }, "slow");
    let role = localStorage.getItem("role_xembong365");
    if(role === null) role = "none";
    let nameUser = $(".chat_input-name").val();
    let content = $(".chat_input-content").val();
    var reBadWords = /lồn|địt|cặc|buồi|bướm|bím|mẹ|dit|cave|chịch/gi;
    var goodContent = content.replace(reBadWords,"****");
    let avt = localStorage.getItem("avt_xembong365");
    let data = {
      username: nameUser,
      content: goodContent,
      avt: avt,
      role : `role_${role}`,
    };
    if (nameUser ==="" || content ==="") {
      var contentToast = $(".toast-content");
      contentToast.html("Tên hoặc nội dung chat phải nhiều hơn 2 kí tự !");
      var toastLiveExample = $("#liveToast");
      var toast = new bootstrap.Toast(toastLiveExample);
      toast.show();
    } else {
      $(".chat_input-content").val("");
      $(".btn_chat-content").attr("disabled", "true");
      $(".fa-paper-plane").css("color", "#ccc");
      socket.emit("client-send-data", data);
      var contentToast = $(".toast-content");
      contentToast.html("Vui long cho 2 phut sau de tiep tuc chat !");
      var toastLiveExample = $("#liveToast");
      var toast = new bootstrap.Toast(toastLiveExample);
      toast.show();
      setTimeout(() => {
        $(".btn_chat-content").removeAttr("disabled");
        $(".fa-paper-plane").css("color", "#963cff");
      }, 15000);
    }
  });
});
