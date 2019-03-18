<script type="text/javascript">
var div = document.getElementById('post-comments-feed')

var templates = {
  prefix: '',
  suffix: ' ago',
  seconds: 'less than a minute',
  minute: '1 minute',
  minutes: '%d minutes',
  hour: '1 hour',
  hours: '%d hours',
  day: '1 day',
  days: '%d days',
  month: '1 month',
  months: '%d months',
  year: '1 year',
  years: '%d years'
}

var template = function(t, n) {
  return templates[t] && templates[t].replace(/%d/i, Math.abs(Math.round(n)))
}

var timer = function(time) {
  if (!time) return
  time = time.replace(/\.\d+/, '') // remove milliseconds
  time = time.replace(/-/, '/').replace(/-/, '/')
  time = time.replace(/T/, ' ').replace(/Z/, ' UTC')
  time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, ' $1$2') // -04:00 -> -0400
  time = new Date(time * 1000 || time)

  var now = new Date()
  var seconds = ((now.getTime() - time) * 0.001) >> 0
  var minutes = seconds / 60
  var hours = minutes / 60
  var days = hours / 24
  var years = days / 365

  return (
    templates.prefix +
    ((seconds < 45 && template('seconds', seconds)) ||
      (seconds < 90 && template('minute', 1)) ||
      (minutes < 45 && template('minutes', minutes)) ||
      (minutes < 90 && template('hour', 1)) ||
      (hours < 24 && template('hours', hours)) ||
      (hours < 42 && template('day', 1)) ||
      (days < 30 && template('days', days)) ||
      (days < 45 && template('month', 1)) ||
      (days < 365 && template('months', days / 30)) ||
      (years < 1.5 && template('year', 1)) ||
      template('years', years)) +
    templates.suffix
  )
}

function itemMock(post) {
	 var comments = post.comments.map(comment => {
		return `<div class="post-comment">
			  <h5 class='user-comment-name'>${comment.name}</h5>
			  <p class="user-comment">${comment.comment}</p>
			  <p class="user-comment-info">${timer(comment.created_at)} <i class="fas fa-heart"></i> ${comment.commentlikesCount}</p>
			</div>`
	  })
	 var content = `<br/>`
	 if(post.postMediaType === 'image'){
		 content = `<div class="img-attch"><img src="https://yea.jobesk.com/api/public/${post.postattachments[0].attachmentURL}" alt="post-attachment"></div>`
	 }else if (post.postMediaType === 'video'){
		 content = `<div class="vid-attch"><video controls>
				<source src="https://yea.jobesk.com/api/public/${post.postattachments[0].videoURL}"/>
			</video></div>`
	 }
	var imageAvatar = `<img src="https://yea.jobesk.com/api/public/${post.profileImage}" alt="user-image">`
	if (!post.profileImage){
		imageAvatar = `<img src="https://www.shareicon.net/download/2015/09/24/106423_user_512x512.png" alt="user-image">`
		}
  var date = timer(post.created_at)
  var container = `<div class="post">
            <div class="user-info">
                ${imageAvatar}
                <div class="user-name">
                    <h4>${post.name}</h4>
                    <p class="date"><i class="far fa-clock"></i> ${date}</p>
                </div>
            </div>
            <div class="post-data">
                <h4>
                    ${post.postDescription}
                </h4>
                ${content}
				<h4 class="likes"><i class="fas fa-heart"></i> ${post.postLikesCount}</h4>
				<div class="post-comments">
                  ${comments}
                </div>
            </div>
          </div>`
  return container
}

fetch('http://yea.jobesk.com/Allposts')
  .then(res => res.json())
  .then(res => {
    var data = res.Result.data
    data.map(post => {
      div.insertAdjacentHTML('beforeend', itemMock(post))
    })
  })


var leaderboardFeed = document.getElementById('leaderboard-feed');

function itemMockLeaderboard(user) {
	var imageAvatar = `<img src="https://yea.jobesk.com/api/public/${user.profileImage}" alt="user-image">`
	if (!user.profileImage){
		imageAvatar = `<img src="https://www.shareicon.net/download/2015/09/24/106423_user_512x512.png" alt="user-image">`
	}
  var container = `<div class="leaderboard-feed-item"> 
  ${imageAvatar}
  <div class="user-data">
    <h2>${user.name} ${user.Surname}</h2>
    <p>${user.jobTitle}</p>
    <p class="company-name">${user.companyName}</p>
  </div>
  <div class="user-follow">
    <p class="points">Points: ${user.points}</p>
    </div>
  </div>`

  return container
}

fetch('http://yea.jobesk.com/leaderboard')
  .then(res => res.json())
  .then(res => {
    var data = res.Result
    data.map(user => {
      leaderboardFeed.insertAdjacentHTML('beforeend', itemMockLeaderboard(user))
    })
  })

</script>