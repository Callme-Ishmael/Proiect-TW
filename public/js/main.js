window.HAS_MAIN_PAGE = true

function addStylesToCards() {
    console.log("hey")
    const choices = [
        ['#96d0eb', '#e89ab6'],
        ['#9dd984', '#7dc4c9'],
        ['#c0af81', '#ff0058'],
        ['#5fb89f','#83d173'],
        ['#03adfc','#6853ad'],
        ['#e8c258', '#e37d24'],
        ['#ab23b8', '#5b14b3']
    ]
    const carduri = document.querySelectorAll(".container .box")
    carduri.forEach((el, idx) => {
        console.log("stilizat un element")
        const [color1, color2] = choices[Math.floor(Math.random() * choices.length)]
        el.style.setProperty('--back-value', `linear-gradient(315deg, ${color1}, ${color2})`)
    })
}

function preventDefaultStuff()
{
    const carduri = document.querySelectorAll(".carduri .box .box-content")
    carduri.forEach((e, index) => {
        const goToCurs = (cid) => {
            window.location.href = `/curs?curs_index=${cid}`
        }

        e.addEventListener("click", (event) => {
            console.log("Clicked on Card")
        })
        const linkEl = e.querySelector("a")
        linkEl.addEventListener("click", (event) => {
            if (index != 0)
                event.stopPropagation()
            console.log("Clicked Read More Button")
            goToCurs(index)
        })
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
                <div mytags="${curs.tags.join(' ')}" class="box-content">
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
        // dupa fetch asteptam 200ms sa dam impresia de incarcare
        await sleep(200)
        elimina_loading_card()
        populate_cursuri(r.data)
        addStylesToCards()
        dynamicBackground()
        preventDefaultStuff()
        loadTags(r.data)
    })
}

function addSearchEventListener()
{
    const el = document.getElementById("mySearch").onkeyup = myFunction
}

function myFunction() {
    const input = document.getElementById("mySearch");
    const filter = input.value.toUpperCase();
    const cards = document.querySelectorAll(".carduri .container .box")
    cards.forEach(el => {
        const found_in_text = (text) => {
            return text.toUpperCase().includes(filter)
        }

        const exists = 
            found_in_text(el.querySelector(".box-content h2").textContent) ||
            found_in_text(el.querySelector(".box-content p").textContent)
        
        if (exists) 
            el.style.display = "flex"
        else
            el.style.display = "none"    
    })
}

function dynamicBackground()
{
    const sidebarEl = document.querySelector(".sidebar a.active")
    const color = window.getComputedStyle(sidebarEl).color
    const bcolor = window.getComputedStyle(sidebarEl).background
    const firstCardContent = document.querySelector(".carduri .box .box-content")
    const firstCardBtn = firstCardContent.getElementsByTagName("a")[0]
    firstCardBtn.style.color = color
    firstCardBtn.style.background = bcolor

    const updateFirstCardOpacity = () => 
    {
        const searchObj = document.getElementById("mySearch")
        const firstCard = document.querySelector(".carduri .box h2")
        console.log(firstCard.getBoundingClientRect().y)
        let height = firstCard.getBoundingClientRect().x % 100
        // height = 70 + height / 3
        console.log(height)
        searchObj.style.color = `hsl(${height/2+220}, 96%, 50%)`
        // firstCard.style.height = height*2;
    
        console.log(`Set opacity by horizontal position: ${firstCard.style.opacity}`)
    }

    updateFirstCardOpacity()
    window.onresize = updateFirstCardOpacity
}

function onSidebarClick(e)
{
    const tag = e.target.text

    document.querySelector("#mySearch ").value = `#${tag}`

    const myContainer = document.querySelector(".carduri .container");
    const cards = Array.from(myContainer.getElementsByClassName("box"))
    cards.forEach(el => {
        const tagsText = el.querySelector("div.box-content")
            .getAttribute("mytags")
            .toLowerCase()
        
        if (tagsText.includes(tag.toLowerCase())) 
            el.style.display = "flex"
        else
            el.style.display = "none"
    })
}

function loadTags(cursuri)
{
    const toPascalCase = (sentence) => sentence
        .split(' ')
        .map(word => word[0]
            .toUpperCase()
            .concat(word.toLowerCase().slice(1)))
        .join(' ');

    const removeDuplicates = (array) => {
        return array.filter((a, b) => array.indexOf(a) === b)
    };

    const allTags = removeDuplicates(
        cursuri
            .map(c => c.tags)
            .flat()
            .map(x => toPascalCase(x))
    )

    const menu = document.querySelector(".sidebar")
    allTags.map(x => {
        const el = document.createElement("a")
        el.setAttribute("href", `#${x}`)
        el.textContent = x
        el.addEventListener("click", onSidebarClick)
        menu.appendChild(el)
    })
}


