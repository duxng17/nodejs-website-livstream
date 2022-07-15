    let scheduleLiveItemLength = document.querySelectorAll('.schedule_live-item').length
    let bannerSchedulesScore = document.querySelectorAll(".banner_schedule-score")
    bannerSchedulesScore.forEach( (bannerScheduleScore , index) => {
        if (bannerScheduleScore.innerHTML !== "0 - 0"){
            bannerScheduleScore.classList.remove("d-none")
            document.querySelectorAll(".banner_schedule-time")[index].style.display = "none"
            document.querySelectorAll(".schedule_time")[index].style.display = "none"
            document.querySelectorAll(".schedule_score")[index].classList.remove("d-none")
        } 
    })
    for ( let i = 0 ; i < scheduleLiveItemLength ; i++){
        let scheduleTimer = document.querySelectorAll('.banner_schedule-timer')[i].innerHTML
        let scheduleDate = document.querySelectorAll('.schedule_date')[i]
        let scheduleTime = document.querySelectorAll('.schedule_time')[i]
        let now = new Date().getTime();
             let countDownDate = new Date(scheduleTimer).getTime();
             let distance = countDownDate - now;
             let days = Math.floor(distance / (1000 * 60 * 60 * 24));
             let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
             let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
             let seconds = Math.floor((distance % (1000 * 60)) / 1000);
             if (days == 0 && hours == 0  &&  minutes < 30) {
                 scheduleDate.innerHTML = "Sắp Diễn Ra " ;
             }
             if (distance < 0) {
                 var daysPassed = Math.floor((now - countDownDate) / (1000 * 60 * 60 * 24));
                 var hoursPassed = Math.floor(((now - countDownDate) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                 var minutesPassed = Math.floor(((now - countDownDate) % (1000 * 60 * 60)) / (1000 * 60));
                 var secondsPassed = Math.floor(((now - countDownDate) % (1000 * 60)) / 1000);
                 if (hoursPassed == 0 && daysPassed == 0){
                     if (minutesPassed  <= 47 ) {
                         scheduleDate.innerHTML = "Đang Diễn Ra ";
                         scheduleTime.innerHTML = `${minutesPassed}'` ;
                     }
                     else if (minutesPassed > 47 && minutesPassed <= 57 ) {
                         scheduleTime.innerHTML = "Hết Hiệp 1"
                         scheduleDate.innerHTML = "Đang Diễn Ra ";
                     }
                     else if (minutesPassed > 57){
                         scheduleDate.innerHTML = "Đang Diễn Ra ";
                         scheduleTime.innerHTML = `${minutesPassed - 12}'` ;
                     }
                 }
                 else if (hoursPassed == 1 && daysPassed == 0){
                     if (minutesPassed >= 0 && minutesPassed < 45) {
                         scheduleDate.innerHTML = "Đang Diễn Ra ";
                         scheduleTime.innerHTML = `${minutesPassed + 48}'` ;
                     } else if (minutesPassed >= 45) {
                         scheduleTime.innerHTML = "Hết Giờ";
                     }
                 }
                 else if (hoursPassed > 1 && daysPassed == 0 ) {
                     scheduleDate.innerHTML = "Hết Giờ";
                 }
             }
     }      