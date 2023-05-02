let myBirthday= moment("2011-04-12 02:41+05:30")
function age () {
    let now= moment()
    let diff= moment.preciseDiff(myBirthday,now)
    return diff
}

window.addEventListener("DOMContentLoaded", function () {
    let span= document.getElementById("age")
    setInterval(function () {
        span.innerText = age()
    },1000) 
})
