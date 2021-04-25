
module.exports = {
    //dburl: 'mongodb://127.0.0.1:27017/kannywoodtv-dev'
    dburl:`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.ybmxa.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`
};