function sleep(ms){
    return new Promise( resolver => setTimeout(resolver, ms));
};

function addStylesToCards() {
    console.log("hey")
    const choices = [
        ['#96d0eb', '#e89ab6'],
        ['#4dff03', '#00d0ff'],
        ['#c0af81', '#ff0058']
    ]
    const carduri = document.querySelectorAll(".container .box")
    carduri.forEach((el, idx) => {
        console.log("stilizat un element")
        const [color1, color2] = choices[Math.floor(Math.random() * 3)]
        // el.style.background = `linear-gradient(315deg, ${color1}, ${color2})`
        el.style.setProperty('--back-value', `linear-gradient(315deg, ${color1}, ${color2})`)
    })
}

async function loadAndAddCards()
{
    const elementForCards = document.querySelector('.content > .carduri > .container')

    function elimina_loading_card()
    {
        elementForCards.innerHTML = ''
    }

    function populate_cursuri(cursuri)
    {
        cursuri.forEach(curs => {
            const innerHtmlText = `
                <span></span>
                <div class="box-content">
                    <h2>${curs.titlu}</h2>
                    <p>
                        ${curs.descriere}</p>
                    <a href="#">Read More</a>
                </div>
            `
            
            const el = document.createElement('div')
            el.classList.add('box')
            el.innerHTML = innerHtmlText
            elementForCards.appendChild(el)
        })
    }

    await fetch('/cursuri')
    .then(r => r.json())
    .then(async r => {
        await sleep(200)
        elimina_loading_card()
        populate_cursuri(r.data)
        addStylesToCards()
    })
}

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

function addSearchEventListener()
{
    const el = document.getElementById("mySearch").onkeyup = myFunction
}

window.onload = async () => {
    addSearchEventListener()

    getLoginStatus()

    loadAndAddCards()
}

function myFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("mySearch");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myMenu");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
        } else {
        li[i].style.display = "none";
        }
}
}
