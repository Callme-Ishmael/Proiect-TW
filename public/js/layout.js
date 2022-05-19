function sleep(ms){
    return new Promise( resolver => setTimeout(resolver, ms));
};

function getLoginStatus()
{
    fetch('/user/info')
        .then(r => r.json())
        .then(resp => {
            if (resp.status == "OK") {
                const {authenticated, user} = resp.data
                console.log(resp.data)
                if (authenticated) {
                    document.getElementById("logout-comp").style.display = "block"
                    document.getElementById("nume-comp").style.display = "block"
                    document.querySelector("#nume-comp > a").innerHTML = user.user
                }
                else {
                    document.getElementById("login-comp").style.display = "block"
                }
            }
        })
}


function footerSetup()
{
    const elTime = document.querySelector(".wrapper .foot p.current-time > span")
    console.log(elTime)
    const ElLastTime = document.querySelector(".wrapper .foot p.last-time > span")
    console.log(ElLastTime)

    const updateTime = () => 
    {
        const date = new Date;
        const timeString = date.toLocaleString('en-US')
        elTime.textContent = timeString
    }

    const displayLastTime = () =>
    {
        let date = localStorage.getItem("last-time")
        if (!date) 
            date = "-"

        ElLastTime.textContent = date

        localStorage.setItem("last-time", (new Date).toString())
    }
    
    displayLastTime()
    updateTime()

    setInterval(updateTime, 1000)
}

window.onload = async () => {
    getLoginStatus()
    
    footerSetup()

    if (window.HAS_MAIN_PAGE) {
        loadAndAddCards()
        addSearchEventListener()
    }

    if (window.HAS_LOGIN_PAGE) {
        addFormEventListeners()
    }

    if (window.HAS_CURS_PAGE) {

    }
}