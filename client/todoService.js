// todoService.js

export default class TodoService {
    constructor($resource) {
        return this.$resource = $resource('/api/v1/todo/:id', {id: '@_id'}, {
            update: {
                method: 'PUT' // this method issues a PUT request
            },
            get: {method: 'get', isArray: true}
        });
    }

    static todoFactory($resource){
        'ngInject';

        return new TodoService($resource);
    }
}