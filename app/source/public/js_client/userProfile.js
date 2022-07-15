$(document).ready(() => {
  const deleteAccount = async () => {
    try {
        const response = await axios({
            method : "post" ,
            url : "http://localhost:3000/user/profile_delete_account",
            headers : {
                "Authorization" :  "Bearer" + " " + getStorage().accessToken,
                "Content-type" : "application/json"
            }
        })
        const result = response.data
        return result ;
    }catch(err){
        alert(err.response.data.message || err)
        throw new Error(err.response.data.message || err);
    }
  }
  const updatePassword =  async (passwordCurrent, passwordAfter) => {
    try {
        const response = await axios({
            method : "post" ,
            url : "http://localhost:3000/user/profile_update_password",
            data : { passwordCurrent : passwordCurrent ,passwordAfter:passwordAfter } ,
            headers : {
                "Authorization" :  "Bearer" + " " + getStorage().accessToken,
                "Content-type" : "application/json"
            }
        })
        const result = response.data
        return result ;
    }catch(err){
        alert(err.response.data.message || err)
        throw new Error(err.response.data.message || err);
    }
  }
  const updateEmail = async (email) => {
    try {
        const response = await axios({
            method : "post" ,
            url : "http://localhost:3000/user/profile_update_email",
            data : { email : email} ,
            headers : {
                "Authorization" :  "Bearer" + " " + getStorage().accessToken,
                "Content-type" : "application/json"
            }
        })
        const result = response.data
        return result ;
    }catch(err){
        alert(err.response.data.message || err)
        throw new Error(err.response.data.message || err);
    }
  }
  const updateUserId = async (userId) => {
    try {
        const response = await axios({
            method : "post" ,
            url : "http://localhost:3000/user/profile_update_userId",
            data : { userId : userId} ,
            headers : {
                "Authorization" :  "Bearer" + " " + getStorage().accessToken,
                "Content-type" : "application/json"
            }
        })
        const result = response.data
        return result ;
    }catch(err){
        alert(err.response.data.message || err)
        throw new Error(err.response.data.message || err);
    }
  }
  const FormDataFile= (input) => {
    let fd = new FormData()
    fd.append('image', input.get(0).files[0],'avt_pic')
    return fd ;
  }
  const uploadingImg = (srcImg) => {
    localStorage.setItem('avt_xembong365',srcImg)
    $('.box_avatar-img').attr('src',srcImg)
    $('.header_avatar-img').attr('src',srcImg)
    $('.profile_user-avt').attr('src',srcImg)
    if (srcImg === '/img/avt-2.png' || srcImg === '/img/admin.png') {
        $('.btn_delete-avt').css('display','none')
    }
  }
  const saveImg = async (srcImg) => {
    try {
        const response = await axios({
            method : "post" ,
            url : "http://localhost:3000/user/profile_update_avt",
            headers : {
                "Authorization" :  "Bearer" + " " + getStorage().accessToken,
                "Content-type" : "application/json"
            },
            data : {
                avt : srcImg,
            },
        })
        const result = response.data
        return result;
    }catch(err) {
        // console.log(err)
        alert(err.response.data.message || err)
        throw new Error(err.response.data.message || err);
    }
  }
  const delImg = async (srcImg) => {
    try {
        const response = await axios({
            method : "delete" ,
            url : srcImg ,
            headers : {
                "Authorization" :  "Bearer" + " " + getStorage().accessToken,
                "Content-type" : "application/json"
            }
        })
        const result = response.data
        return result ;   
    }catch(err) {
        alert(err.response.data.message || err)
        throw new Error(err.response.data.message || err);
    }
  }
  const updateImg = async (fd) => {
    try {
        const response = await axios({
            method : "post",
            url : "http://localhost:3333/images",
            headers : {
                "Authorization" :  "Bearer" + " " + getStorage().accessToken,
                "Content-type" : "application/json"
            },
            data : fd ,
        })
        const srcImg = `http://localhost:3333/images/${response.data.result.Key}`
        return srcImg ;
    }catch (err) {
        console.log(err);
        alert(err.response.data.message || err)
        throw new Error(err.response.data.message || err);
    }
  }
  const retriveDataUser = async () => {
    try {
      const response = await axios({
        method: "POST",
        url:  "http://localhost:3000/user/profile",
      });
      const user = response.data;
      return user;
    } catch (err) {
      console.log(err);
    }
  };
  const innerInfoUser = async () => {
    const user = await retriveDataUser();
    uploadingImg(user.avt)
    $(".profile_userId").html(`${user.userId}`);
    $(".profile_email").html(`${user.email}`);
    $(".input_profile-userId").val(`${user.userId}`);
    $(".input_profile-email").val(`${user.email}`);
    switch (user.role) {
      case "admin":
        $(".profile_role").html(`Quản trị viên`);
        break;
      case "member":
        $(".profile_role").html(`Thành viên`);
        break;
      case "user":
        $(".profile_role").html(`Người dùng mới`);
        break;
    }
  };
  $(".btn_complete-avt").click( async ()  => {
    try {
        await validateUser();
        const user = await retriveDataUser()
        if(user.avt !== '/img/avt-2.png' && user.avt !== '/img/admin.png') await delImg(user.avt)
        let inputProfileAvt = $('.input_profile-avt')
        const fd = FormDataFile(inputProfileAvt)
        const srcImg = await updateImg(fd);
        uploadingImg(srcImg)
        const result = await saveImg(srcImg);
        alert(result.message)
        if(result.success === "true"){
            $('.input_profile-avt').toggleClass('d-none')
            $('.btn_avt-after').css('display','none')
            $('.btn_avt-before').css('display','block')
            $('.btn_delete-avt').css('display','block')
        }
        return;
    } catch(err){
        console.log(err)
        alert(`Vui lòng chọn tệp ; ${err}`|| err.response.data.message)
    }
  })
  $(".btn_confirm-delAvt").click( async ()  => {
    try {
        await validateUser();
        const user = await retriveDataUser()
        const result = await delImg(user.avt)
        uploadingImg('/img/avt-2.png')
        await saveImg('/img/avt-2.png');
        alert(result.message)
        $('.validation_del-avt').css('display','none')
    }catch(err){
        console.log(err)
        alert( err.response.data.message||err)
    }
  })

  $('.btn_complete-userId').click( async () => {
    try {
        await validateUser();
        console.log("validate complete")
        const newUserId = $('.input_profile-userId').val();
        const result = await updateUserId(newUserId)
        alert(result.message)
        localStorage.setItem('userId_xembong365',newUserId)
        $('.userId_after').css('display','none')
        $(".profile_userId").html(newUserId);
        $('.headerBtn__register').html(newUserId)
        $('.userId_before').css('display','block');
    }catch(err){
        console.log(err)
        alert( err.response.data.message||err)
    }
  })
  $('.btn_complete-email').click( async () => {
    try {
        await validateUser();
        const newEmail = $('.input_profile-email').val();
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
        if(!regex.test(newEmail)) return alert('VUI LÒNG NHẬP ĐÚNG ĐỊNH DẠNG EMAIL')
        const result = await updateEmail(newEmail)
        alert(result.message)
        $('.email_after').css('display','none')
        $(".profile_email").html(newEmail);
        localStorage.setItem('email_xembong365',newEmail)
        $('.email_before').css('display','block');
    }catch(err){
        console.log(err)
        alert( err.response.data.message||err)
    }
  })
  $('.btn_confirmUpdate-password').click( async () => {
    const passwordCurrent =  $('.input_password-current').val()
    const passwordAfter =  $('.input_password-after').val()
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (passwordCurrent === "" || passwordAfter === "") return alert('KHÔNG ĐƯỢC ĐỂ TRỐNG')
    if(!regex.test(passwordAfter)) return alert('Mật khẩu phải chứa tối thiểu 8 ký tự, ít nhất một chữ cái, một số và một ký tự đặc biệt !')
    try{
        await validateUser();
        const result = await updatePassword(passwordCurrent, passwordAfter)
        alert(result.message)
        $('.account_after').css('display','none')
        $('.account_before').css('display','block');
    }catch(err){
        console.log(err)
        alert( err.response.data.message||err)
    }
  })
  $('.btn_confirm-delAccount').click( async () => {
    try {
        await validateUser();
        const avt = getStorage().avt ;
        await delImg(avt)
        const result = await deleteAccount();
        logOut(result.message)
    }catch(err){
        console.log(err)
        alert( err.response.data.message||err)
    }
  })

  innerInfoUser();
});
