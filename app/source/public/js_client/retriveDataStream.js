$(document).ready(() => {
  let widthPlayer = "100%";
  let linkStream = "";
  let banner = "";
  jwplayer.key = "uoW6qHjBL3KNudxKVnwa3rt5LlTakbko9e6aQ6VUyKQ=";
  let p2pConfig = {
    live: true,
    announceLocation: "hk",
    swFile: "https://xembong365.com/sw.js",
    useHttpRange: true,
    p2pEnabled: true,
    showSlogan: false,
  };
  if (
    !Hls.P2pEngine.isMSESupported() ||
    Hls.P2pEngine.getBrowser() === "Mac-Safari"
  ) {
    new Hls.P2pEngine(p2pConfig);
  }

  const jwPlayerSetup = (jwPlayerConfig) => {
    jwplayer("demoplayer").setup(jwPlayerConfig);
  };
  const jwPlayerOnPlay = () => {
    jwplayer().on("play", function () {
      jwplayer().hls.p2pEngine.on(
        "stats",
        function ({ totalHTTPDownloaded, totalP2PDownloaded }) {
          console.log(
            ` total downloaded : ${totalHTTPDownloaded} & total P2P Downloaded : ${totalP2PDownloaded}`
          );
        }
      );
    });
  };
  const innerCountDownTimer = (days, hours, minutes, seconds) => {
    $(".schedule_timer-days").html(days);
    $(".schedule_timer-hours").html(hours);
    $(".schedule_timer-minutes").html(minutes);
    $(".schedule_timer-seconds").html(seconds);
  };
  const coutDownTimerStream = (data) => {
    const countDownDate = new Date(data.timer).getTime();
    let x = setInterval(() => {
      let now = new Date().getTime();
      let distance = countDownDate - now;
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (distance < 0) {
        clearInterval(x);
        $(".schedule_timer").css("display", "none");
        $(".stream_info-content").addClass("mb-3");
        let jwPlayerConfig = {
          sharing: {
            sites: ["reddit", "facebook", "twitter"],
          },
          playlist: [
            {
              file: linkStream,
              image: banner,
            },
          ],
          width: widthPlayer,
          aspectratio: "16:9",
          stretching: "fill",
          preload: "metadata",
          hlsjsdefault: true,
          hlsjsConfig: {
            p2pConfig,
          },
          intl: {
            vi: {
              errors: {
                cantPlayVideo:
                  "TR???N ?????U ???? K???T TH??C , C??C B???N VUI L??NG CHUY???N SANG K??NH KH??C ",
                cantLoadPlayer:
                  "TR???N ?????U ???? K???T TH??C , C??C B???N VUI L??NG CHUY???N SANG K??NH KH??C ",
                liveStreamDown:
                  "XEMBONG365.COM ??ANG C?? S??? C??? , C??C B???N VUI L??NG CH??? ?????I TRONG ??T PH??T , XIN C???M ??N",
              },
            },
          },
        };
        jwPlayerSetup(jwPlayerConfig);
        jwPlayerOnPlay();
      }
      innerCountDownTimer(days, hours, minutes, seconds);
    }, 1000);
  };
  const setDefautJwConfig = (data)=> {
    data.linkStream === ""
      ? (linkStream = "/video/intro.mp4")
      : (linkStream = data.linkStream);
    banner = data.banner;
  };
  const checkStatusStream = (data) => {
    const streamStatus = data.statusStream;
    if (streamStatus.begining === true ) {
      $(".schedule_timer").css("display", "none");
      $(".stream_info-content").addClass("mb-3");
      let jwPlayerConfig = {
        sharing: {
          sites: ["reddit", "facebook", "twitter"],
        },
        playlist: [
          {
            file: linkStream,
            image: banner,
          },
        ],
        width: widthPlayer,
        aspectratio: "16:9",
        stretching: "fill",
        preload: "metadata",
        hlsjsdefault: true,
        hlsjsConfig: {
          p2pConfig,
        },
        intl: {
          vi: {
            errors: {
              cantPlayVideo:
                "TR???N ?????U CH??A DI???N RA HO???C V???A K???T TH??C , C??C B???N VUI L??NG ?????I TRONG ??T PH??T ! ",
              cantLoadPlayer:
                "TR???N ?????U CH??A DI???N RA HO???C V???A K???T TH??C , C??C B???N VUI L??NG ?????I TRONG ??T PH??T ! ",
              liveStreamDown:
                "XEMBONG365.COM ??ANG C?? S??? C??? , C??C B???N VUI L??NG CH??? ?????I TRONG ??T PH??T , XIN C???M ??N",
            },
          },
        },
      };
      jwPlayerSetup(jwPlayerConfig);
    } else {
      let jwPlayerConfig = {
        playlist: [
          {
            file: linkStream,
            image: banner,
          },
        ],
        controls: false,
        width: widthPlayer,
        aspectratio: "16:9",
        stretching: "fill",
      };
      jwPlayerSetup(jwPlayerConfig);
      coutDownTimerStream(data);
    }
  };
  const retriveStreamData = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: window.location.href
      });
      setDefautJwConfig(response.data);
      checkStatusStream(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  retriveStreamData();
});
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});
