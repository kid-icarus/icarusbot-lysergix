var http = require('http')

module.exports = function(bot) {
  var base =  'http://smiley.meatcub.es:1337/api/v1/'
  bot.on('msg', function(msg) {
    var regex = /^!face ?(.*)$/
    var matches = msg.msg.match(regex)

    if (!matches) {
      return
    }

    var getFace = function(endpoint) {
      var body = ''
      if (!endpoint) {
        endpoint = 'random'
      }
      else if (isNaN(endpoint)) {
        endpoint = 'random/' + encodeURI(endpoint)
      }
      else {
        endpoint = 'faces/' + endpoint
      }

      var req = http.get(base + endpoint, function(res){
        res.on('data', function(chunk) {
          body += chunk.toString()
        })
        res.on('end', function(){
          face = JSON.parse(body)
          bot.msg([msg.chan], (msg.sender + ': ' + face.content))
        })
      })
    }

    var getTags = function() {
      var body = ''
      var req = http.get(base + 'tags', function(res){
        if (res.statusCode !== 200) {
          return
        }
        res.on('data', function(chunk) {
          body += chunk.toString()
        })
        res.on('end', function(){
          tags = JSON.parse(body).join(', ')
          bot.msg([msg.chan], (msg.sender + ': ' + tags))
        })
      })
    }

    var endpoint = 'random'
    if (matches[1] === 'tags') {
      getTags()
    }
    else {
      getFace(matches[1])
    }
  })
}
