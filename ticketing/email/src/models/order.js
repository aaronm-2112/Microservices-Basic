"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.OrderStatus = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var common_1 = require("@ecomtickets/common");
Object.defineProperty(exports, "OrderStatus", { enumerable: true, get: function () { return common_1.OrderStatus; } });
var mongoose_update_if_current_1 = require("mongoose-update-if-current");
var orderSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(common_1.OrderStatus),
        default: common_1.OrderStatus.Created
    },
    ticket: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Ticket'
    },
    email: {
        type: String,
        required: false
    }
}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
orderSchema.set('versionKey', 'version');
orderSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
// order of statics using build and creating the model matters
orderSchema.static('build', function (attrs) {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        userId: attrs.userId,
        status: attrs.status,
        email: attrs.email,
        ticket: attrs.ticket
    });
});
var Order = mongoose_1.default.model('Order', orderSchema);
exports.Order = Order;
