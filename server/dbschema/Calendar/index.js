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
    plans: {
        type: [mongoose.Schema.Types.ObjectId],
    }
});


const PlanSchema = new mongoose.Schema({
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
    createdTime: {
        type: Date,
    },
    planned_outfits: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    occasion: {
        type: String,
    }
});

module.exports = {
    Calendar: mongoose.model('Calendar', CalendarSchema),
    Day: mongoose.model('Day', Day),
    Occasion: mongoose.model('Occasion', PlanSchema)
}

