"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_update_if_current_1 = require("mongoose-update-if-current");
var ticketSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
ticketSchema.static('build', function (attrs) {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
});
var Ticket = mongoose_1.default.model('Ticket', ticketSchema);
exports.Ticket = Ticket;
