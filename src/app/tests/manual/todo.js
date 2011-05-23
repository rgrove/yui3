YUI.add('todo', function (Y) {

var TodoAppView, TodoList, TodoModel, TodoView;

// -- Model --------------------------------------------------------------------
TodoModel = Y.TodoModel = Y.Base.create('todoModel', Y.Model, [], {
    sync: LocalStorageSync('todo'),

    toggleDone: function () {
        this.set('done', !this.get('done')).save();
    }
}, {
    ATTRS: {
        createdAt: {valueFn: Y.Lang.now},
        done     : {value: false},
        text     : {value: ''}
    }
});

var ATodoModel = Y.Base.create('aTodoModel', TodoModel, []);

// -- ModelList ----------------------------------------------------------------
TodoList = Y.TodoList = Y.Base.create('todoList', Y.ModelList, [], {
    model: TodoModel,
    sync : LocalStorageSync('todo'),
    
    comparator: function (model) {
        return model.get('createdAt');
    },
    
    done: function () {
        var done = [];
        this.each(function(todo){ todo.get('done') && done.push(todo) });
        return done;
    },
    
    remaining: function () {
        var remaining = [];
        this.each(function(todo){ ! todo.get('done') && remaining.push(todo) });
        return remaining;
    }
});

// -- Views --------------------------------------------------------------------
TodoView = Y.TodoView = Y.Base.create('todoView', Y.View, [], {
    container: '<li class="todo-item"/>',
    template : Y.one('#todo-item-template').getContent(),

    events: {
        '.todo-checkbox': {click: 'toggleDone'},
        '.todo-content' : {click: 'edit'},

        '.todo-input'   : {
            blur    : 'save',
            keypress: 'enter'
        },

        '.todo-remove': {click: 'remove'}
    },

    initializer: function () {
        var model = this.model;
        model.after('change', this.render, this);
        model.after('destroy', this.destroy, this);
    },

    render: function () {
        var model = this.model;

        this.container.setContent(Y.Lang.sub(this.template, {
            checked: model.get('done') ? 'checked' : '',
            text   : model.getAsHTML('text')
        }));

        this.inputNode = this.container.one('.todo-input');

        return this;
    },

    // -- Event Handlers -------------------------------------------------------
    edit: function () {
        this.container.addClass('editing');
        this.inputNode.focus();
    },

    enter: function (e) {
        if (e.keyCode === 13) { // enter key
            Y.one('#new-todo').focus();
        }
    },

    remove: function () {
        this.constructor.superclass.remove.call(this);
        this.model.delete().destroy();
    },

    save: function () {
        this.container.removeClass('editing');
        this.model.set('text', this.inputNode.get('value')).save();
    },

    toggleDone: function () {
        this.model.toggleDone();
    }
});

TodoAppView = Y.TodoAppView = Y.Base.create('todoAppView', Y.View, [], {
    container   : Y.one('#todo-app'),
    inputNode   : Y.one('#new-todo'),
    template    : Y.one('#stats-template').getContent(),

    events: {
        '#new-todo'     : {keypress: 'create'},
        '.todo-clear a' : {click: 'clearCompleted'}
    },

    initializer: function (config) {
        var todoList = this.todoList = (config && config.todoList) || new TodoList();

        todoList.after('add', this.add, this);
        todoList.after('refresh', this.refresh, this);
        todoList.after(['update', 'todoModel:doneChange'], this.render, this);
        
        todoList.load();
    },
    
    render: function () {
        var todoList    = this.todoList,
            stats       = this.container.one('#todo-stats'),
            numRemaining, numDone;
            
        if (todoList.isEmpty()) {
            stats.empty();
            return this;
        }
        
        numRemaining    = todoList.remaining().length;
        numDone         = todoList.done().length;
        
        stats.setContent(Y.Lang.sub(this.template, {
            numRemaining    : numRemaining,
            remainingLabel  : numRemaining === 1 ? 'item' : 'items',
            numDone         : numDone,
            doneLabel       : numDone === 1 ? 'item' : 'items'
        }));
        
        if ( ! numDone) {
            stats.one('.todo-clear').remove();
        }
        
        return this;
    },

    // -- Event Handlers -------------------------------------------------------
    add: function (e) {
        var view = new TodoView({model: e.model});
        this.container.one('#todo-list').append(view.render().container);
    },

    create: function (e) {
        if (e.keyCode === 13) { // enter key
            this.todoList.create({
                text: this.inputNode.get('value')
            });

            this.inputNode.set('value', '');
        }
    },

    refresh: function (e) {
        var fragment = Y.one(Y.config.doc.createDocumentFragment());

        Y.Array.each(e.models, function (model) {
            var view = new TodoView({model: model});
            fragment.append(view.render().container);
        });

        this.container.one('#todo-list').setContent(fragment);
    },
    
    clearCompleted: function (e) {
        var todoList    = this.todoList,
            done        = todoList.done();
        
        todoList.remove(done, { silent: true });
        Y.Array.each(done, function(todo){
            todo.delete().destroy();
        });
        this.render();
    }
});

// -- localStorage Sync Implementation -----------------------------------------
function LocalStorageSync(key) {
    if (!key) { Y.error('No storage key specified.'); }
    if (!localStorage) { Y.error("localStorage isn't supported."); }

    var data = Y.JSON.parse((localStorage && localStorage.getItem(key)) || '{}');

    function destroy (id) {
        var modelHash;

        if ((modelHash = data[id])) {
            delete data[id];
            save();
        }

        return modelHash;
    }

    function generateId () {
        var id = '',
            i  = 4;

        while (i--) {
            id += (((1 + Math.random()) * 0x10000) | 0)
                    .toString(16).substring(1);
        }

        return id;
    }

    function get(id) {
        return id ? data[id] : Y.Object.values(data);
    }

    function save() {
        localStorage && localStorage.setItem(key, Y.JSON.stringify(data));
    }

    function set(modelHash) {
        modelHash.id || (modelHash.id = generateId());
        data[modelHash.id] = modelHash;
        save();

        return modelHash;
    }

    return function (action, options, callback) {
        // `this` refers to the Model or ModelList instance to which this sync
        // method is attached. `store` refers to the LocalStorageSync instance.
        var isModel = Y.Model && this instanceof Y.Model,
            hash;

        if (action === 'create' || action === 'update') {
            hash = this.toJSON();
        }

        switch (action) {
        case 'create': // intentional fallthru
        case 'update':
            callback(null, set(hash));
            return;

        case 'read':
            callback(null, get(isModel && this.get('id')));
            return;

        case 'delete':
            callback(null, destroy(isModel && this.get('id')));
            return;
        }
    };
}

}, '@VERSION@', {requires: ["event-focus", "json", "model", "model-list", "view"]});
