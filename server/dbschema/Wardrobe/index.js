const { mongoose } = require('../../mongoose');

const WardrobeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    created_time: {
        type: Date
    },
    items: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    outfits: {
        type: [mongoose.Schema.Types.ObjectId],
    }
});

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    created_time: {
        type: Date,
    },
    type: {
        type: String,
    },
    color: {
        type: String,
    },
    season: {
        type: String,
    },
    style: {
        type: String,
    },
    occasion: {
        type: String,
    },
    budget: {
        type: String,
    },
    brand: {
        type: String,
    },
    size: {
        type: String,
    },
    owned: {
        type: Boolean,
    },
    market_link: {
        type: String,
    }
});

module.exports = {
    Wardrobe: mongoose.model('Wardrobe', WardrobeSchema),
    Item: mongoose.model('Item', ItemSchema)
}