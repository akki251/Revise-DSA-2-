const aTagsEl = document.querySelectorAll(".problem");
var inputTagsEl = document.querySelectorAll(".question-input");
var subContainers = document.querySelectorAll(".sub-container");

aTagsEl.forEach((val, index) => {
  val.addEventListener("click", () => {
    subContainers[index].classList.add("sub-active");
    val.classList.add("active");
    inputTagsEl[index].classList.add("done");
    // console.log(inputTagsEl[index]);
  });
});

const freqMain = document.querySelectorAll(".freq-main");

const freqForm = document.querySelectorAll(".freq-hid");

const btnSubmit = document.querySelector(".btn-submit");

btnSubmit.addEventListener("click", () => {
  inputTagsEl.forEach((inputTag) => {
    if (inputTag.classList.contains("done")) {
    } else {
      inputTag.value = 1;
    }
  });

  freqMain.forEach((input, index) => {
    freqForm[index].value = freqMain[index].value;
  });
});

// const freqMainEl = freqMain[0];
// freqMainEl.addEventListener("input", () => {
//   console.log(freqMainEl.value);
// });
