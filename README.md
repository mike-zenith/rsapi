# rsapi

RisingStars Api

# Under heavy development

This is a private(ish) repo.

### Getting strated

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
- config/app.json
- config/middleware.json

Create / change env-specific settings 
- config/app-[env].json
- config/middleware-[env].json
```

Configuration is based on kraken's nconf integration, it first loads the base config (config/app.json) then looks for the env specific one (config/app-test.json) .

### Used modules, documentations

#### yo, aka yeoman
[Url](http://yeoman.io/)
```
# yo is an app scaffolding module, it generates grunt files and creates the requested files / directories based on cli args
```

#### kraken.js
Full stack framework by paypal

[Url](http://krakenjs.com/)

[Github](https://github.com/krakenjs/kraken-js)

#### generator-kraken
[Url](https://www.npmjs.org/package/generator-kraken)

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

#### Grunt 
Grunt is a js task-runner

[Url](http://gruntjs.com/)

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

#### ORM
The currently used orm is called node-orm2

[Github, homepage](https://github.com/dresende/node-orm2)

[Wiki](https://github.com/dresende/node-orm2/wiki)
