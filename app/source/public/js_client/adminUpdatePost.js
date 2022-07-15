$(document).ready( () => {
    const formUpdatePost = $('#form_update-post')
  
    const serializeForm = function (form) {
      let obj = {};
      let formData = new FormData(form);
      for (let key of formData.keys()) {
          obj[key] = formData.get(key);
      }
      return obj;
      };

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
            return srcImg;
        } catch (err) {
            console.log(err);
            alert(err.response.data.message || err)
            throw new Error(err.response.data.message || err);
        }
    }

    formUpdatePost.submit(async (event) => {
      event.preventDefault();
        try {
            await validateUser();
            const objFormData = serializeForm(event.target);
            if(objFormData.srcBanner && objFormData.banner.size !== 0  ){
                await delImg(objFormData.srcBanner)
            }
            if(objFormData.banner.size !== 0 ){
                let formData = new FormData()
                formData.append('image', objFormData.banner, 'banner_pic')
                objFormData.banner = await addImg(formData);
            }
            if(objFormData.banner.size === 0 ){
                delete objFormData.banner 
            }
            delete objFormData.srcBanner
            // console.log(objFormData)
            const response = await axios({
                method: 'post',
                url: `http://localhost:3000/admin/update-post?id=${objFormData.id}`,
                headers: {
                    'Content-type': 'application/json'
                },
                data: objFormData ,
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