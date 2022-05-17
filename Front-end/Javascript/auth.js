$(document).ready(function(){
    console.log('check auth')

    $("button.login-button").click(
        function(){
            
            const email = $("#email").val()
            const password = $("#password").val()

            if(!email){
                console.log('Error: empty email')
                return
            }
            email.match()
            // console.log()
            if(!new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)){
                console.log('Error: invalid email')
            }
            if(!password){
                console.log('Error: empty password')
                return
            }

            const credentials = {
                email,
                password
            }

            const result = loginUser(credentials)

            if(result===true){
                window.location.href = window.location.origin + '/Front-end/index.html'
            }
            else{
                console.log(result)
            }
        }
    )
    $("button.register-button").click(
        function(){
            
            const fName = $("#firstName").val()
            const lName = $("#lastName").val()
            const email = $("#email").val()
            const password = $("#password").val()

            if(!fName){
                console.log('Error: empty first Name')
                return
            }
            if(!lName){
                console.log('Error: empty last Name')
                return
            }
            if(!email){
                console.log('Error: empty email')
                return
            }
            email.match()
            // console.log()
            if(!new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)){
                console.log('Error: invalid email')
            }
            if(!password){
                console.log('Error: empty password')
                return
            }

            const user = {
                fName,
                lName,
                email,
                password
            }

            const result = createUser(user)

            if(result===true){
                window.location.href = window.location.origin + '/Front-end/index.html'
            }
            else{
                console.log(result)
            }

        }
    )
})