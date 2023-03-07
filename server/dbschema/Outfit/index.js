const { mongoose } = require('../../mongoose');

const OutfitCollectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    created_time: {
        type: Date,
    },
    is_private: {
        type: Boolean,
    },
    occasion: {
        type: String,
    },
    season: {
        type: String,
    },
    style: {
        type: String,
    },
    color: {
        type: String,
    },
    outfits: {
        type: [mongoose.Schema.Types.ObjectId],
    }
});

const OutfitSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    created_time: {
        type: Date,
    },
    is_private: {
        type: Boolean,
    },
    occasion: {
        type: String,
    },
    season: {
        type: String,
    },
    style: {
        type: String,
    },
    color: {
        type: String,
    },
    Budget: {
        type: String,
    },
    items: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    is_AI: {
        type: Boolean,
    },
    Is_missing: {
        type: Boolean,
    },
    is_favorite: {
        type: Boolean,
    },
    is_worn: {
        type: Boolean,
    },
    is_deleted: {
        type: Boolean,
    },
    is_archived: {
        type: Boolean,
    },
    is_shared: {
        type: Boolean,
    },

});

module.exports = {
    Outfit: mongoose.model('Outfit', OutfitSchema),
    OutfitCollection: mongoose.model('OutfitCollection', OutfitCollectionSchema)

}



