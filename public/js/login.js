function addFormEventListeners()
{
    const formRegister = document.getElementById("form-register")
    const formLogin = document.getElementById("form-login")

    let registerUser = ''
    let registerPass = ''
    let loginUser = ''
    let loginPass = ''

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

    formRegister.addEventListener('submit', (e) => {
        e.preventDefault()
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
                formRegister.querySelector('label').checked = false
                formLogin.querySelector('label').checked = true
                // window.location.href = '/'
                alert(`Account created, you can now login`)
            }
        })
    })

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

window.onload = () =>
{
    addFormEventListeners()
}