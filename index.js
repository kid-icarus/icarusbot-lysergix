var http = require('http')

module.exports = function(bot) {
  bot.on('msg', function(msg) {
    if (msg.msg === '!face') {
      var body = ''
      var req = http.get('http://smiley.meatcub.es:1337/api/v1/random', function(res){
        res.on('data', function(chunk) {
          body += chunk.toString()
        })
        res.on('end', function(){
          face = JSON.parse(body)
          bot.msg([msg.chan], (msg.sender + ': ' + face.content))
        })
      })
    }
  })
}
