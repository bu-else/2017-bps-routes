var express=require('express');
var app = express();

app.set('port', 3000);
app.listen(app.get('port'), function (){
  console.log('Example app listening on port 3000!')
})

app.get('/', (req, res) =>  {
  res.sendFile(__dirname +'/index.html')
  return
})
