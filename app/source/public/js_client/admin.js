$(document).ready(function () {
  const formAddMatch = $('#form_add-match')
  const formAddPost = $('#form_add-post')
  const imgBannerUploaded = $('.img_banner-uploaded')
  const rebuildMatchObj = async (obj) => {
    const newMatch = {
        league :  obj.league,
        team1 : {
          fullName :  obj.fullName1,
          shortName :  obj.shortName1,
          logo :  obj.logo1,
          score :  obj.score1,
        },
        team2 : {
          fullName :  obj.fullName2,
          shortName :  obj.shortName2,
          logo :  obj.logo2,
          score :  obj.score2,
        },
        props : {
          stream : false ,
          hot : false
        },
        stadium :  obj.stadium,
        timer :  obj.timer,
    }
    if(obj.banner.size !== 0 ){
        let formData = new FormData()
        formData.append('image', obj.banner, 'banner_pic')
        newMatch.banner = await addImg(formData);
    }
    console.log(obj)
    if(obj.stream === "true" ){
        newMatch.props.stream = true ;
    }
    if(obj.hot === "true" ){
        newMatch.props.hot = true ;
    }
    return newMatch ;
  }

  const serializeForm = function (form) {
    let obj = {};
    let formData = new FormData(form);
    for (let key of formData.keys()) {
        obj[key] = formData.get(key);
    }
    return obj;
    };

  const uploading = (response, srcImg) => {
      if (response.data.originalName === "banner_pic") {
          alert(response.data.message)
          imgBannerUploaded.attr('src', srcImg)
          imgBannerUploaded.css("display", "block");
      }
  }
  const addImg = async (formData) => {
    const accessToken = localStorage.getItem('accessToken_xembong365')
      try {
          const response = await axios({
              method: 'post',
              url: 'http://localhost:3333/images',
              headers: {
                "Authorization" :  "Bearer" + " " + accessToken,
                "Content-Type": "multipart/form-data",
              },
              data: formData,
          })
          const srcImg = `http://localhost:3333/images/${response.data.result.Key}`
          uploading(response, srcImg);
          return srcImg;
      } catch (err) {
          console.log(err);
          alert(err.response.data.message || err)
          throw new Error(err.response.data.message || err);
      }
  }
  formAddMatch.submit(async (event) => {
    event.preventDefault();
      try {
          await validateUser();
          const objFormData = serializeForm(event.target);
          const newMatch = await rebuildMatchObj(objFormData);
          const response = await axios({
              method: 'post',
              url: 'http://localhost:3000/admin/add-match',
              headers: {
                  'Content-type': 'application/json'
              },
              data: newMatch ,
          })
          document.location.reload();
          if (response.data.success === "true") {
              alert(response.data.message);
          }
      } catch (err) {
          console.log(err);
          alert(` Có lỗi ; ${err.message}` || err.response.data.message);
      }
  })
  formAddPost.submit(async (event) => {
    event.preventDefault();
    const inputBannerPost = $('#upload_photo-post').get(0).files[0]
    if(!inputBannerPost) return alert('VUI LÒNG CHỌN TỆP')
    try {
      await validateUser();
      const objFormData = serializeForm(event.target);
      const formData = new FormData()
      formData.append('image' , inputBannerPost , 'banner')
      const srcImg = await addImg(formData);
      objFormData.banner = srcImg ;  
      const response = await axios({
        method: 'post',
        url: 'http://localhost:3000/admin/add-post',
        headers: {
            'Content-type': 'application/json'
        },
        data: objFormData ,
    })
    if (response.data.success === "true") {
        alert(response.data.message);
    }
    document.location.reload();
    } catch(err){
      console.log(err);
      alert(` Có lỗi ; ${err.message}` || err.response.data.message);
    }
})
})