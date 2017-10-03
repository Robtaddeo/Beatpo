// your custom app logic goes here:

(function(){
	console.log('Hello Audio Stream!')
	var currentUser = null
	var uploading = null

	var uploadFile = function(){
		turbo.uploadFile(function(err, data){
			if (err){
				alert('Error:' + err.message)
				return
			}

			console.log('Upload Complete: ' + JSON.stringify(data))
			// Upload Complete: {"confirmation":"success",
			// "result":{"site":"59ce9f1f448851001216bdb7","name":"One.mp3",
			// "type":"audio/mp3",
			// "url":"https://storage.turbo360.co/audio-stream-xshd8x/One.mp3",
			// "size":3750848,"timestamp":"2017-08-26T14:04:57.365Z","schema":"blob","id":"59a1800970606a00113c0010"}}

			if (uploading == 'icon'){
				var image = data.result.url

				turbo.update('user', currentUser, {image: image}, function(err, data){
					if (err){
						alert('Error: ' + err.message)
						return
					}

					console.log('USER UPDATED: ' + JSON.stringify(data))
					currentUser = data.result
					$('#profile-icon').attr('src', currentUser.image+'=s96-c')
				})

				return
			}


			if (uploading == 'track'){
				var file = data.result

				// update current user:
				var tracks = currentUser.tracks || []
				tracks.push(file)

				turbo.update('user', currentUser, {tracks: tracks}, function(err, data){
					if (err){
						alert('Error: ' + err.message)
						return
					}

					console.log('USER UPDATED: ' + JSON.stringify(data))
					currentUser = data.result
					renderTracks()
				})

				return
			}

		})
	}

	var renderTracks = function(){
		if (currentUser == null)
			return

		var tracksList = ''
		currentUser.tracks.forEach(function(track, i){
			tracksList += '<tr><td style="width:130px"><a target="_blank" href="' + track.url + '"><img src="/dist/images/playbutton.png" alt="..." /></a></td>'
			tracksList += '<td><h5><a target="_blank" href="' + track.url + '">' + track.name + '</a></h5><p>Uploaded: ' + track.timestamp + '</p></td>'
			tracksList += '<td><h4 class="price">$40</h4></td></tr>'
		})

		$('#tracks-table').html(tracksList)
	}

	var turbo = Turbo({site_id: '59ce9f1f448851001216bdb7'})
	turbo.currentUser(function(err, data){
		if (err){
			console.log('No One Logged In')
			return
		}

		console.log('Current User: ' + JSON.stringify(data))
		currentUser = data.user
		renderTracks()
		$('#header-name').html(data.user.name)
		$('#header-username').html('@' + data.user.username)
		$('#profile-icon').attr('src', currentUser.image+'=s96-c')
	})

	$('#btn-upload').click(function(event){
		event.preventDefault()
		if (currentUser == null) // no one logged in
			return


		console.log('Upload Track')
		uploading = 'track'
		uploadFile()
	})


	$('#button-join').click(function(event){
		event.preventDefault()

		var visitor = {

			username: $('#input-username').val(),
			name: $('#input-name').val(),
			email: $('#input-email').val(),
			password: $('#input-password').val(),

		}

		if (visitor.name.length == 0){
			alert('Please enter your name')
			return
		}

		if (visitor.email.length == 0){
			alert('Please enter your email')
			return
		}

		if ($('#input-password-confirm').val() != visitor.password){
			alert('Your passwords do not match')
			return
		}

		if (visitor.password.length == 0){
			alert('Please enter your password')
			return
		}

		// console.log('Register: ' + JSON.stringify(visitor))
		turbo.createUser(visitor, function(err, data){
			if (err){
				alert('Error: ' + err.message)
				return
			}

			console.log('User Created: ' + JSON.stringify(data))
			window.location.href = '/admin'
		})
	})

	$('#profile-icon').click(function(event){
		event.preventDefault()

		if (currentUser == null) // no one logged in
			return


		console.log('Upload Icon')
		uploading = 'icon'
		uploadFile()
	})

	// Login / Logout functions
	$('#btn-login').click(function(event){
			event.preventDefault()

			// These values should come from a form tag in an html document:
			var credentials = {

				username: $('#input-username-login').val(),
				password: $('#input-password-login').val()

			}

			turbo.login(credentials, function(err, data){
				if (err){
					alert('Error:' + err.message)
					return
				}

				window.location.href = '/admin'
			})
		})



	$('#nav-logout').click(function(event){
	event.preventDefault()

	turbo.logout(function(err, data){
		if (err){
			alert('Error:' + err.message)
			return
		}

		window.location.href = '/'

	})
})

	// if (currentUser == null){
	// 	$('#login-logout').html("Login")
	// }
	//
	// if (currentUser != null){
	// 	$('#login-logout').html("Logout")
	// }

})()
