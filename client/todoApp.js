// todoApp.js
import uiRouter from 'angular-ui-router';
import ngResource from 'angular-resource';
import ngMoment from 'angular-moment';

import TodoService from './todoService';
import WebSocket from './websocket';
import Auth from './auth';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';

import './todo.scss';

export default angular.module('todoApp', [
        uiRouter,
        ngResource,
        ngMoment.name
    ])
    .service(WebSocket.name, WebSocket)
    .factory('todoSvc', TodoService.todoFactory)
    .run(appConfig)
    .config(route);


class TodoController {

    constructor(todos, todoSvc, WebSocket) {
        console.log(todos);
        this.newTodo = {
            title: '',
            done: false
        };

        this.todos = todos;
        this.todoSvc = todoSvc;

        WebSocket.on('news', (data) => {
            console.log('news from socket', data);
        });
        WebSocket.on('todo:changed', this.refresh.bind(this));
    }

    refresh(todo) {
        if (Auth.getCurrentUser() !== todo.userId) {
            console.log('todos changed', todo);
            // other user changed todo
            // --> we could reload everything like
            // todoSvc.get().$promise.then((todos) => {
            //     this.todos = todos;
            // });
            // --> but better add or replace todo
            let index = this.todos.indexOf(todo._doc);
            if (index === -1) {
                this.todos.push(todo._doc);
            }
            else {
                this.todos[index] = todo._doc;
            }
            // delete not handled yet!!
        }
    }

    add() {
        let newTodo = new this.todoSvc(this.newTodo);

        console.log('add', newTodo);
        this.todos.push(newTodo);

        newTodo.$save();
        //this.todoSvc.save(newTodo);
        // this.todos.$save();
        this.newTodo.title = '';
        this.newTodo.done = false;
    }

    remove(todo) {
        // this.todoSvc.delete({id: todo._id}).$promise.then((data) => {
        //     console.log('deleted', data);
        //     this.todos.splice(index,1);
        // });
        this.todoSvc.delete(todo, (data) => {
            console.log('deleted', data);
            let index = this.todos.indexOf(todo);
            this.todos.splice(index,1);
        });
        // todo.$delete((data) => {
        //     console.log('deleted', data, index);
        //     this.todos.splice(index,1);
        // });
        // this.todoSvc.delete({_id: todo._id});
    }

    toggleFormDone(todo) {
        //evt.preventDefault();
        todo.done = !todo.done
    }

    toggleDone(todo) {
        console.log('toggle state');
        todo.done = !todo.done;
        this.todoSvc.update(todo, function(data) {
            console.log('Updated todo', data, todo);
        });
        //todo.$save();
    }
}


function route($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('todos', {
        url: '/',
        template: require('./todoList.html'),
        controller: TodoController,
        controllerAs: 'todoCtrl',
        resolve: {
            todos: (todoSvc) => {
                return todoSvc.get().$promise;
            }
        }
    });
}


function appConfig(amTimeAgoConfig) {
    angular.extend(amTimeAgoConfig, {
        fullDateThreshold: 3,
        fullDateFormat: 'MMM D \'YY [at] HH:MM'  //Dec 19 '13 at 18:16
    });
}