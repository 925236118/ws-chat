const mongoose = require('mongoose')

const Schema = mongoose.Schema

const messageSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  }
})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/express-chat')
}

main()
  // .then(res => {
  //   console.log('mongo链接成功')
  // })
  .catch(err => {
    console.log(err)
    console.log('mongo链接失败')
  })

module.exports = {
  Message: mongoose.model('Message', messageSchema)
}
