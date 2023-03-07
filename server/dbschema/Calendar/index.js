const { mongoose } = require('../../mongoose');

const CalendarSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
    },
    created_time: {
        type: Date
    },
    days: {
        type: [mongoose.Schema.Types.ObjectId],
    }
});

const Day = new mongoose.Schema({
    date: {
        type: Date,
    },
    occasions: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    planned_outfits: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    weather: {
        type: mongoose.Schema.Types.Mixed,
    }
});

const OccasionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
    },
    planned_outfits: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    place: {
        type: String,
    }

});

module.exports = {
    Calendar: mongoose.model('Calendar', CalendarSchema),
    Day: mongoose.model('Day', Day),
    Occasion: mongoose.model('Occasion', OccasionSchema)
}

