
const setupHeader = (storage) => {
  document.querySelector(".header_avatar-img").setAttribute('src',storage.avt)
  document.querySelector(".userId").innerHTML = storage.userId ;
  document.querySelector('.avatar').style.display = 'block';
  document.querySelector(".email").innerHTML = storage.email;
  document.querySelector(".box_avatar-img").setAttribute('src',storage.avt)
  if (storage.role === "admin" ) {
    document.querySelector(".infoBox_btn-logout").style.display = "none"
    document.querySelector(".admin").style.display = "block"
  }
  document.querySelector(".header_logout").addEventListener("click", () => logOut("ĐĂNG XUẤT THÀNH CÔNG"));
  document.querySelector(".infoBox_btn-logout").addEventListener("click", () => logOut("ĐĂNG XUẤT THÀNH CÔNG"));
}

const getStorage = () => {
  const userId = localStorage.getItem("userId_xembong365");
  const id = localStorage.getItem("id_xembong365");
  const expireAccessToken = localStorage.getItem("expireAccessToken_xembong365");
  const expireRefreshToken = localStorage.getItem("expireRefreshToken_xembong365");
  const role = localStorage.getItem("role_xembong365")
  const refreshToken = localStorage.getItem("refreshToken_xembong365")
  const accessToken = localStorage.getItem("accessToken_xembong365")
  const avt = localStorage.getItem("avt_xembong365")
  const email =  localStorage.getItem("email_xembong365");
  const loginStatus = localStorage.getItem("loginStatus_xembong365");
  return { userId , id , expireAccessToken , expireRefreshToken , role , refreshToken , accessToken , avt , email , loginStatus}
}
const storeAccessToken = (cname , cvalue , exMins) => {
  console.log('updated accessToken')
  let expires = "expires=" + (new Date(exMins)).toUTCString();
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}
const updateStorage = async () => {
  const tokens = await getTokens();
  let newRefreshToken = tokens.refreshToken.token;
  let newExpireRefreshToken = tokens.refreshToken.expire;
  let newAccessToken = tokens.accessToken.token ; 
  let newExpireAccessToken = tokens.accessToken.expire ;
  storeAccessToken('accessToken_xembong365',newAccessToken,"session")
  localStorage.setItem("expireAccessToken_xembong365", `${newExpireAccessToken}`);
  localStorage.setItem("accessToken_xembong365", `${newAccessToken}`);
  localStorage.setItem("refreshToken_xembong365", `${newRefreshToken}`);
  localStorage.setItem("expireRefreshToken_xembong365", `${newExpireRefreshToken}`);
  console.log('updated storage')
  const storage = getStorage();
  console.log('return NEW  STORAGE SUCCESSFULLY')
  return storage ;
}
const checkExpireRefreshToken = async (aliveTimeAccessToken, aliveTimeRefreshToken) => {
  if (aliveTimeRefreshToken < 0) {
    console.log('REFRESH TOKEN EXPIRED')
    throw new Error("Phiên bản đăng nhập hết hạn")
  }
  const storage = await checkExpireAccessToken(aliveTimeAccessToken)
  return storage ;
};
const checkExpireAccessToken = async (aliveTimeAccessToken) => {
    if(aliveTimeAccessToken > 0 ) {
      const storage = getStorage();
      return storage ;
    }
    console.log('ACCESS TOKEN EXPIRED')
    const storage = await updateStorage();
    return storage
};
const getTokens = async () => {
  console.log('get Tokens and save new refreshToken in db')
  const refreshToken = getStorage().refreshToken
  try {
      let response = await axios({
          method: "post",
          url: "http://localhost:5555/tokens",
          headers: {
              "Content-Type": "application/json",
          },
          data: {
              refreshToken: refreshToken
          },
      });
      const tokens = response.data.tokens
      return tokens
  } catch (err) {
    console.log(err)
      if(err.data) return logOut(err.response.data.message);
      logOut(err);
  }
};
const destroyRefreshToken = async (refreshToken) => {
  try {
    const response = await axios({
        method: "post",
        url: "http://localhost:5555/logout",
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            refreshToken: refreshToken
        },
    });
    console.log(response)
    return response ;
  } catch (err) {
    console.log(err)
    alert(err)
    document.location.replace("/");
  }
}
const logOut = async (message) => {
  console.log('LOG OUT SUCCESS FULLY')
  const refreshToken = getStorage().refreshToken 
  storeAccessToken('accessToken_xembong365','',0) //delete accessToken in cookie
  await destroyRefreshToken(refreshToken); 
  localStorage.clear();
  alert(message);
  document.location.replace("/");
};
const logging = async () => {
  let now = new Date().getTime();
  const expireAccessToken = localStorage.getItem("expireAccessToken_xembong365");
  const expireRefreshToken = localStorage.getItem("expireRefreshToken_xembong365");
  const aliveTimeAccessToken = expireAccessToken - now;
  const aliveTimeRefreshToken = expireRefreshToken - now;
  try {
    const newStorage = await checkExpireRefreshToken(aliveTimeAccessToken, aliveTimeRefreshToken);
    console.log('GET STORAGE SUCCESSFULLY')
    setupHeader(newStorage);   
  } catch (err) {
    console.log(err)
    logOut(err)
  }
};
const notLogin = () => {
  document.querySelector(".headerBtn__register").style.display = "block";
  document.querySelector(".headerBtn__login").style.display = "block";
};

const validateUser = async () => {
  const loginStatus = localStorage.getItem("loginStatus_xembong365");
  if (loginStatus !== "true") {
      console.log('not login')
      notLogin();
  } else {
      console.log('logging')
      await logging();
  }
};

validateUser();