// your custom app logic goes here:

(function() {

  console.log('Hello Beatpo!')

  var turbo = Turbo({ site_id: '59ce9f1f448851001216bdb7' })
  turbo.currentUser(function(err, data) {
    if (err){
      console.log("No One Logged In")
      return
    }

    $('#header-username').html(data.user.name)
  })

  $('#btn-upload').click(function(event) {
    event.preventDefault()
    console.log('Upload Track')
  })


  $('#button-join').click(function(event){
    event.preventDefault()

    var visitor = {
      name: $('#input-name').val(),
      email: $('#input-email').val(),
      username: $('#input-username').val(),
      password: $('#input-password').val()

    }

    if (visitor.name.length == 0){
      alert('Please enter your name')
      return
    }
    if (visitor.name.email == 0){
      alert('Please enter your email')
      return
    }
    if (visitor.name.username == 0){
      alert('Please enter your username')
      return
    }
    if (visitor.password.length == 0){
      alert('Please enter your password')
      return
    }

    turbo.createUser(visitor, function(err, data){
      if (err){
        alert('Error: ' + err.message)
      }

      console.log('User Created: ' + JSON.stringify(visitor))
      window.location.href="/admin"

    })

  })


})()
