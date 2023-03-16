const { mongoose } = require('../../mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    calendar: {
        type: mongoose.Schema.Types.ObjectId,
    },
    wardrobe: {
        type: mongoose.Schema.Types.ObjectId,
    },
    outfits: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    outfits_collections: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    friends: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    preference_tags: {
        type: mongoose.Schema.Types.Mixed,
    }
});

module.exports = {
    User: mongoose.model('User', UserSchema)
}