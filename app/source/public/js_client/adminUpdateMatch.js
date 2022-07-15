$(document).ready( () => {
    const formUpdateMatch = $('#form_edit-match')
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
          stadium :  obj.stadium,
          timer :  obj.timer,
      }
      if(obj.banner.size !== 0 ){
          let formData = new FormData()
          formData.append('image', obj.banner, 'banner_pic')
          newMatch.banner = await addImg(formData);
      }
      if(obj.stream === "true" && obj.hot !== "true" ){
        newMatch.props = {
            stream : true ,
            hot : false
        }
      }
      if(obj.hot === "true" && obj.stream !== "true" ){
        newMatch.props = {
            stream : false ,
            hot : true
        }
      }
      if(obj.hot === "true" && obj.stream === "true" ) {
        newMatch.props = {
            stream : true ,
            hot : true
        }   
      }
      if(obj.none === "true" ) {
        newMatch.props = {
            stream : false ,
            hot : false
        } 
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

    const delImg =  async (srcImg) => {
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

    formUpdateMatch.submit(async (event) => {
      event.preventDefault();
        try {
            await validateUser();
            const objFormData = serializeForm(event.target);
            if(objFormData.srcBanner && objFormData.banner.size !== 0  ){
                await delImg(objFormData.srcBanner)
            } 
            const match = await rebuildMatchObj(objFormData);
            // console.log(objFormData.id)
            const response = await axios({
                method: 'post',
                url: `http://localhost:3000/admin/update-match?id=${objFormData.id}`,
                headers: {
                    'Content-type': 'application/json'
                },
                data: match ,
            })
            if (response.data.success === "true") {
                alert(response.data.message);
            }
            document.location.replace('/admin');
        } catch (err) {
            console.log(err);
            alert(` Có lỗi ; ${err.message}` || err.response.data.message);
        }
    })

})