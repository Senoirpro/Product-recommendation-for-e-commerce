$(document).ready(async function(){
    console.log('check auth')

    const displayError = (err) =>{
        console.log(err)

        $("p.error").html(err)
    }


    $("button.login-button").click(
        async function(){
            
            
            const username = $("#username").val()
            // const email = $("#email").val()
            const password = $("#password").val()

            if(!username){
                displayError('Error: empty username')
                return
            }
            // if(!email){
            //     displayError('Error: empty email')
            //     return
            // }
            // email.match()
            // if(!new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)){
            //     displayError('Error: invalid email')
            // }
            if(!password){
                displayError('Error: empty password')
                return
            }

            const credentials = {
                username,
                password
            }

            const result = await loginUser(credentials)

            if(result===true){
                window.location.href = window.location.origin + '/Front-end/index.html'
            }
            else{
                console.log(result)
            }
        }
    )
    $("button.register-button").click(
        async function(){
            
            const username = $("#username").val()
            const fName = $("#firstName").val()
            const lName = $("#lastName").val()
            const email = $("#email").val()
            const password = $("#password").val()

            if(!username){
                displayError('Error: empty username')
                return
            }
            if(!fName){
                displayError('Error: empty first Name')
                return
            }
            if(!lName){
                displayError('Error: empty last Name')
                return
            }
            if(!email){
                displayError('Error: empty email')
                return
            }
            email.match()
            if(!new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)){
                displayError('Error: invalid email')
                return
            }
            if(!password){
                displayError('Error: empty password')
                return
            }



            const user = {
                username,
                first_name:fName,
                last_name:lName,
                email,
                password
            }

            const result = await createUser(user)

            if(result===true){
                window.location.href = window.location.origin + '/Front-end/Login.html'
            }
            else{
                console.log(result)
            }

        }
    )
})