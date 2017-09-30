// your custom app logic goes here:

(function() {

  console.log('Hello Beatpo!')
  var currentUser = null

  var turbo = Turbo({ site_id: '59ce9f1f448851001216bdb7' })
  turbo.currentUser(function(err, data) {
    if (err){
      console.log("No One Logged In")
      return
    }

    currentUser = data.user
    $('#header-username').html(data.user.name)

    var tracksList = ''
    currentUser.tracks.forEach(function(track, i){
      tracksList += '<tr><td style="width: 130px;"><a target"_blank" href="#"><img src="/dist/images/playbutton.png" alt="..."></a></td>'
      tracksList += '<td><h5>'+track.name+'</h5><p>Superior Sports Watch</p></td>'
      tracksList += '<td><label>Plays: </label><p></p></td>'
      tracksList += '<td><a><h4 class="price">$40</h4></a></td>'
    })

    $('#tracks-table').html(tracksList)
  })

  $('#btn-upload').click(function(event) {
    event.preventDefault()
    console.log('Upload Track')

    turbo.uploadFile(function(err, data){
      if (err) {
        alert('Error: ' + err.message)
        return
      }

      console.log('Upload Complete: ' + JSON.stringify(data))
      var file = data.result

      if (currentUser == null){
        return
      }

      // Update Current User
      var tracks = currentUser.tracks || []
      tracks.push(file)

      turbo.update('user', currentUser, {tracks: tracks}, function(err, data){
        if (err){
          alert('Error: ' + err.message)
          return
        }

          console.log('USER UPDATED: ' + JSON.stringify(data))
      })

    })


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
