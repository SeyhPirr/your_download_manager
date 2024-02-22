////////////setup
const downloads = chrome.downloads;
let paused = false;
let online = navigator.onLine;
//////////////////////////////////////////////////////////////////////online ofline
// function onlineCheck() {
//   if (!navigator.onLine) return (online = false);
//   const controller = new AbortController();

//   // Start a timer that will abort the request after 3 seconds
//   const timeoutId = setTimeout(() => controller.abort(), 2000);

//   fetch("https://www.google.com", { method: "HEAD", signal: controller.signal })
//     .then((response) => {
//       if (response.ok) {
//         console.log("Online");
//         online = true;
//       } else {
//         console.log("Offline");
//         online = false;
//       }
//     })
//     .catch((error) => {
//       console.log("Offline1");
//       online = false;
//     });
// }

///////////////////////////////////////////////////////////////////////////////pause resume action
async function pauseResumeAction(id) {
  if (online && paused) {
    //resume download if there is connection and it is paused
    const resume = downloads.resume(id);

    resume.then(
      () => {
        paused = false;
        console.log("resumed download");
      },
      (error) => {
        console.log("Error: " + error);
      }
    );
  }
  if (!online && !paused) {
    //pause download connection is lost and is not paused
    let pausing = downloads.pause(id);
    pausing.then(
      () => {
        paused = true;
        console.log("Paused download");
      },
      (error) => {
        console.log("Error: " + error);
      }
    );
  }
}
chrome.downloads.onCreated.addListener(function (item) {
  const pasueResume = setInterval(() => {
    online = navigator.onLine;
    pauseResumeAction(item.id);
    // onlineCheck();

    downloads.search({ id: item.id }, function (items) {
      const item = items[0];
      console.log(item.error);
      if (item.state === "interrupted" && online) downloads.resume(item.id);
      else if (item.state !== "in_progress" || item.error === "USER_CANCELED") {
        clearInterval(pasueResume);
      }
    });
  }, 1000);
});
//NETWORK_FAILED
// USER_CANCELED
