$(document).ready(() => {
 const authenticating = async (config) => {
    try {
      const response = await axios(config);
      authenticateSuccessfully(response);
    } catch (err) {
      alert(err.response.data.message);
      throw new Error(err)
    }
  };

const registing = async (user) => {
  try {
    const response = await axios({
      method: "post",
      url: "http://localhost:5555/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: user.email,
        password: user.password,
        userId: user.userId,
      },
    });
    alert(response.data.message)
    $('#container').removeClass('right-panel-active');
  } catch (err) {
    alert(err.response.data.message);
    throw new Error(err)
  }
};

const validateFormSubmit = (user) => {
  if (
    user.password === "" ||
    user.email === "" ||
    user.userId === ""
  ) return alert("VUI LÒNG NHẬP TÀI KHOẢN , MẬT KHẨU HOẶC USER ID ");
  let regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (regex.test(user.password) !== true) return alert("Mật khẩu phải chứa tối thiểu 8 ký tự, ít nhất một chữ cái, một số và một ký tự đặc biệt !");
  registing(user);
  
};
  const storageAccessToken = (cname , cvalue , exMins) => {
    let expires = "expires=" + (new Date(exMins)).toUTCString();
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
  }
  const storageAtLocal = (response) => {
    if (Storage !== undefined) {
      storageInfoAtLocalStorage(response);
    } else {
      alert(" local storage not supported ");
    }
  };
  const storageInfoAtLocalStorage = (response) => {
    localStorage.setItem("id_xembong365", `${response.data.id}`);
    localStorage.setItem("userId_xembong365", `${response.data.userId}`);
    localStorage.setItem("email_xembong365", `${response.data.email}`);
    localStorage.setItem("loginStatus_xembong365", `${response.data.loginStatus}`);
    localStorage.setItem("role_xembong365", `${response.data.role}`);
    localStorage.setItem("avt_xembong365", `${response.data.avt}`);
    localStorage.setItem(
      "expireAccessToken_xembong365", `${response.data.accessToken.expire}`
    );
    localStorage.setItem(
      "expireRefreshToken_xembong365",`${response.data.refreshToken.expire}`
    );
    localStorage.setItem(
      "refreshToken_xembong365",`${response.data.refreshToken.token}`
    );
    localStorage.setItem(
      "accessToken_xembong365",`${response.data.accessToken.token}`
    );
  };
  const login = (email,password) => {
    if (email === "" || password === "") return alert(" vui long nhap tai khoac hoac mat khau !!! ");
    const config = {
      method: "post",
      url: "http://localhost:5555/login",
      data: { email: email, password: password },
      headers: {
        "Content-Type": "application/json",
      },
    };
    authenticating(config);
  };
  const authenticateSuccessfully = (response) => {
    if (response.data.success === "true") {
      storageAccessToken("accessToken_xembong365",response.data.accessToken.token,"session")
      storageAtLocal(response);
      alert(response.data.message);
      response.data.role === "admin"
        ? window.location.replace('/admin')
        : window.location.replace('/');
    }
  };
  $(".btn_login").click(() => {
    let email = $("#form_login .email").val();
    let password = $("#form_login .password").val();
    login(email , password);
  });
  $(".btn_resgister").click( () => {
    const password = $('#form_resgister .password').val()
    const email = $('#form_resgister .email').val()
    const userId = $('#form_resgister .userId').val()
    const user = {password , email , userId}
    validateFormSubmit(user)
  });
  $(".btn_login-mobile").click(() => {
    let email = $(".form_login-mobile .email").val();
    let password = $(".form_login-mobile .password").val();
    login(email , password);
  });
  $(".btn_resgister-mobile").click( () => {
    const password = $('.form_resgister-mobile .password').val()
    const email = $('.form_resgister-mobile .email').val()
    const userId = $('.form_resgister-mobile .userId').val()
    const user = {password , email , userId}
    validateFormSubmit(user)
  });


});
