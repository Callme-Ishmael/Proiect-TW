window.HAS_LOGIN_PAGE = true

function addFormEventListeners()
{
    const formRegister = document.getElementById("form-register")
    const formLogin = document.getElementById("form-login")

    // variabile in care memoram continutul din input field-uri
    let registerUser = ''
    let registerPass = ''
    let loginUser = ''
    let loginPass = ''

    // functie care verifica un username sa respecte regula (intre 3-12 caractere alfabetice)
    const checkRegex = (username) =>
    {
        const reg = new RegExp('^[a-zA-Z]{3,12}$')
        if (!reg.test(username)) {
            alert("Username should contain only letters and have between 3-12 characters")
            return false
        }
        return true
    }

    // adaugam eventlisteners pentru cele 4 input-field-uri pentru a avea valorile uptodate
    document.querySelector(`#form-register input[name="username"]`).addEventListener('change', (e) =>{
        registerUser = e.target.value;
        console.log(`New val: ${registerUser}`)
    })

    document.querySelector(`#form-register input[name="pass"]`).addEventListener('change', (e) =>{
        registerPass = e.target.value;
        console.log(`New val: ${registerPass}`)
    })

    document.querySelector(`#form-login input[name="username"]`).addEventListener('change', (e) =>{
        loginUser = e.currentTarget.value;
        console.log(`New val: ${loginUser}`)
    })

    document.querySelector(`#form-login input[name="pass"]`).addEventListener('change', (e) =>{
        loginPass = e.currentTarget.value;
        console.log(`New val: ${loginPass}`)
    })

    // pentru evenimentul de submit, anulam comportamentul "normal" oriun preventDefault, 
    // deoarece folosim un fetch request pentru a ne loga
    formRegister.addEventListener('submit', (e) => {
        e.preventDefault()

        if (!checkRegex(registerUser))
            return 

        console.log(`Creating user: ${registerUser} | ${registerPass}`)
        fetch('/user/create', {
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: registerUser,
                password: registerPass
            })
        })
        .then(r => r.json())
        .then(resp => {
            if (resp.status != 'OK')
                alert(`Username ${registerUser} taken!`)
            else {
                // window.location.href = '/'
                alert(`Account created, you can now login`)
            }
        })
    })

    // in mod asemanator pentru delogare
    formLogin.addEventListener('submit', (e) => {
        // e.stopPropagation()
        e.preventDefault()
        console.log(`Login with: ${loginUser} | ${loginPass}`)
        fetch('/user/login', {
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: loginUser,
                password: loginPass
            })
        })
        .then(r => r.json())
        .then(resp => {
            console.log(resp)
            if (resp.status != 'OK')
                alert(`Bad username or password!`)
            else {
                window.location.href = '/'
            }
        })
    })
}
