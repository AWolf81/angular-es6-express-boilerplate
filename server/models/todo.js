import mongoose from 'mongoose';
import urlSlug from 'mongoose-url-slugs';
import {activeSockets, curSocket} from '../sockets';

const Schema = mongoose.Schema;

let todoSchema = new Schema({
    title : String,
    done: { 
        type: Boolean, 
        required: false, 
        default: false 
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});


var emitSocketEvent = (doc) => {
    // sockets.in if there where multiple rooms socket.join('todo')
    // curSocket.sockets.in('todo').emit('todo:changed', doc);
    curSocket.emit('todo:changed', doc);
};

todoSchema.post('save', emitSocketEvent);
todoSchema.post('update', emitSocketEvent);


todoSchema.plugin(urlSlug('title')); // creates .slug from title

const Todo = mongoose.model('Todo', todoSchema);

export { todoSchema, Todo};