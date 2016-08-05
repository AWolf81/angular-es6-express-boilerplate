import io from 'socket.io-client';
import Auth from './auth';

export default class WebSocket {
    /* @ngInject */

    constructor($rootScope) {
        this.$rootScope = $rootScope;

        this.init();
    }

    init() {
        let host = window.location.origin;
        let sessionId;
        console.log('WEBSOCKET connecting to', host);

        this.socket = io.connect(host);

        // on connection emit the new user to server
        this.socket.on('connect', () => {
            sessionId = this.socket.io.engine.id;

            console.log('WEBSOCKET connected with session id', sessionId);

            this.socket.emit('new_user', { id: sessionId });
        });


        // this is the new_user event handler
        this.socket.on('new_connection', (data) => {

            if (data.user.id === sessionId) {
                // console.log('user matched', sessionId);
                this.$rootScope.$apply(() => {
                    Auth.setCurrentUser(data.user);
                });
            }
        });
    }

    // registering new event handlers
    on(key, callback) {
        this.socket.on(key, (data) => {
            this.$rootScope.$apply(() => {
                callback(data)
            });
        });
    }

    emit(eventName, data, callback) {
        this.socket.emit(eventName, data, function () {
            var args = arguments;
            this.$rootScope.$apply(function () {
                if (callback) {
                    callback.apply(socket, args);
                }
            });
        });
    }

    send(eventName, data, callback) {
        this.socket.send(eventName, data, function() {
            var args = arguments;
            this.$rootScope.$apply(function() {
                if (callback) {
                    callback.apply(socket, args);
                }
            });
        });
    }
}