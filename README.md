# rsapi

RisingStars Api

# Under heavy development

This is a private(ish) repo.

## Getting strated

```
- Install Node.js [NodeWin also available]
- (Optional) Install git [windows github also available, google it]
- Clone repo
- cd [your-repo-dir]
- npm install (Downloads dependencies)
- npm install yo -g (Installs yeoman globally)
- npm install generator-kraken -g (Installs kraken generator globally)
- grunt migrate:up --environment test (Runs migrations on test env)
- npm test (Tests the application)
- npm start (Runs the application -- NOT FUNCTIONAL)

You can modify application settings by changing
- config/config.json

Create / change env-specific settings 
- config/[env].json

where [env] : dev[elopment], prod[uction], test[ing] ... (kraken.js documentation)
```

Configuration is based on kraken's nconf integration, it first loads the base config (config/app.json) then looks for the env specific one (config/app-test.json) .

## Used modules, documentations

### yo, aka yeoman
[yeoman.io](http://yeoman.io/)
```
# yo is an app scaffolding module, it generates grunt files and creates the requested files / directories based on cli args
```

### kraken.js
Full stack framework by paypal

[krakenjs.com](http://krakenjs.com/)

[Github source](https://github.com/krakenjs/kraken-js)

### generator-kraken
[generator-kraken](https://www.npmjs.org/package/generator-kraken)

Yeoman generator for krakenjs
```
$ yo kraken [myApp] Creates a new kraken application. Parameters:

--templateModule - (Optional) Set the template module
--cssModule - (Optional) Set the CSS module
--jsModule - (Optional) Set the JavaScript module

$ yo kraken:controller myController
Generates a new controller named myController and it's dependencies.

$ yo kraken:model myModel
Generates a new model named myModel.

$ yo kraken:template myTemplate
Generates a new template named myTemplate and it's dependencies.

$ yo kraken:locale myFile [myCountry myLang] Generates a new content bundle named myFile.

```

### Grunt 
Grunt is a js task-runner

[gruntjs.com](http://gruntjs.com/)

We are using it to run tests, migrations and build the application.

The settings and the created tasks can be found in *tasks/* .
General config file is *Gruntfile.js* , the task-specific settings can be found next to their task definitions.

```

$ grunt 
Runs grunt, global parameters:
--environment test - (Optional) Set the environment to test

$ grunt test
Runs test

$ grunt migrate:direction [--file file]
Runs a migration operation on the given file

$ grunt migrate:up
Runs remaining migrations up

$ grunt migrate:down
Rollbacks migrations

$ grunt migrate:generate [file]
Creates a migration file


```

### ORM
The currently used orm is called node-orm2

[Github, node-orm2](https://github.com/dresende/node-orm2)

[Github, wiki](https://github.com/dresende/node-orm2/wiki)


### Migration
Migrations are used for db versioning

[Github, node-migrate-orm2](https://github.com/locomote/node-migrate-orm2)

How to use:
```
$ grunt migrate:generate myUpdate
Creates an update script with 'up' and 'down' part and places it into data/migrations/

$ grunt migrate:up [--file xxx] [--environment env]
Runs migration tasks in up/commit/forward direction from the previously stored db version.
After a successful run, it updates the db version.

$ grunt migrate:down [--file xxx] [--environment env]
Runs migration tasks in down/rollback/backward direction from the previously stored db version.
After a successful run, it updates the db version.

General optional parameters:
--file xxx only run the specified migration script
--environment env run the migration in the specified environment

```

### Mocha , Mocha-cli
Mocha is our test-runner. It provides basic functionality over tdd / bdd tests.

[Mocha homepage](http://visionmedia.github.io/mocha/)
[Grunt task source](https://github.com/Rowno/grunt-mocha-cli)

The tests can be found at test/*. Currently it does not use sub-directories
so you are safe to store fakes / stubs / mocks there.

```
$ grunt mochacli
Runs the tests only without jshinting and environmental settings.
One should not use it to test his code, the proper way is:

$ grunt test
OR
$ npm test

$ grunt test --[spec|mocha] min
Runs the tests with specific mochacli settings where 'min' is the settings key,
check tasks/mochacli.js
```


## How to / FAQ

### What am i supposed to do with this?

This is a private repo, only open for a short period of time, if you have really asked this question, you should leave.

### I want to create a...

One should not create anything without TESTS!
That does not mean that you have to develop in TDD/BDD/whateverDD, that means
you should at least test your code in an optimistic / positive way!

Create a js file into test/ and name it properly.
```
If it is a:
- controller: behaviour test / end-to-end test it at least and it must describe a use-case
- service: behaviour / unit test with specific use cases, unit tests preferred
- middleware: behaviour with fake controller
- model: models are not used individually, implement a use case into a (fake) controller and jump to 'controller' section
and/or check orm2 tests
- anything else: test it individually (unit test) with mocks / fakes and test the implementation in BDD style
```

### I want to make a database change, what should i do?

Define the reason why you need a database update, make it short, use it as the name of your update script.
Im gonna call it 'email-index' in the next example

```
$ grunt migrate:up myUpdate
Creates the migration file into date/migrations/xxx-email-index.js
```

Open it in your favourite IDE, edit the up and down parts:

```js
/* date/migrations/xxx-email-index.js

Read [this page](https://github.com/locomote/node-migrate-orm2).
Reachable methods under *this*:

createTable
dropTable
addColumn
dropColumn
addIndex
dropIndex
addPrimaryKey
dropPrimaryKey
addForeignKey
dropForeignKey

*/
exports.up = function (next) {
    this.addIndex('i_username_email', {
        table: 'user',
        columns: ['username', 'email'],
        unique: true
    }, next);
};

exports.down = function (next) {
    this.dropIndex('i_username_email');
};

```

If you have filled *up* and *down* parts, you may create another migration or
you can run them:

```
$ grunt migrate:up
Runs all the remaining migrations up

OR

$ grunt migrate:up --file xxx-email-index.js

OR

$ grunt migrate:up --environment dev

OR

$ grunt migrate:up --environment test

```

### I messed up the database change, want to rollback, what should i do?
Did you commit / push it?
```
$ grunt migrate:down --file xxx --environment yyy
Where xxx is the migration script you want to rollback, yyy is the environment flag
```
If you did not, rollback it and delete the file.

### How should i create a new controller?

If it is not a REST or some special controller, you should use generator-kraken.
Read the corresponding section about it and use:

```
$ yo kraken:controller myController

```

OR

Create a file under *controllers* directory and name it properly.
```js
// controllers/[your-proper-name].js
'use strict';

module.exports = function (app) {

}
```

Our Kraken framework built on top of express.js and uses
[express-enrouten](https://github.com/krakenjs/express-enrouten) middleware for loading controllers.
You might wanna check out that page for more information, but the basic public methods of app are the same:


```js
// controllers/[your-proper-name].js
'use strict';

module.exports = function (app) {
    app.get('/my-best-url/:id', function (req, res, id) {
        // do something with id

        // send the response
        res.send(output, 200);
        // or res.json , etc.
    });
}
```

### I need a REST controller with CRUD model operations

There is a REST generator which creates the requested methods when the node application
starts.

Currently it is under heavy development and subject to change.

Example:
```js
'use strict';

var Rest = require('../lib/controller/restful'),
    opts;

opts = {
    param: {
        key: 'user_id',
        model: 'user',
        register: 'user'
    }
};

module.exports = Rest('/user', opts)
    .generate();
```



