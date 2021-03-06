require 'coffee-errors'

htmlWiring = require 'html-wiring'
_          = require 'lodash'
path       = require 'path'
yeoman     = require 'yeoman-generator'

helpers    = require './helpers'

class OctobluSentinelGenerator extends yeoman.Base
  constructor: (args, options) ->
    super
    @option 'github-user'
    @currentYear = (new Date()).getFullYear()
    {@realname, @githubUrl} = options
    @skipInstall = options['skip-install']
    @githubUser  = options['github-user']
    @pkg = JSON.parse htmlWiring.readFileAsString path.join __dirname, '../package.json'

  initializing: =>
    @appname = _.kebabCase @appname
    @noSentinel = _.replace @appname, /^sentinel-/, ''
    @env.error 'appname must start with "sentinel-", exiting.' unless _.startsWith @appname, 'sentinel-'

  prompting: =>
    return if @githubUser?
    done = @async()

    prompts = [
      name: 'githubUser'
      message: 'Would you mind telling me your username on GitHub?'
      default: 'octoblu'
    ]

    @prompt(prompts).then (props) =>
      @githubUser = props.githubUser
      done()

  userInfo: =>
    return if @realname? and @githubUrl?

    done = @async()

    helpers.githubUserInfo @githubUser, (error, res) =>
      @env.error error if error?
      @realname = res.name
      @email = res.email
      @githubUrl = res.html_url
      done()

  configuring: =>
    @copy '_gitignore', '.gitignore'

  writing: =>
    filePrefix     = _.kebabCase @noSentinel
    instancePrefix = _.camelCase @noSentinel
    classPrefix    = _.upperFirst instancePrefix
    constantPrefix = _.toUpper _.snakeCase @noSentinel

    context = {@appname, @githubUrl, @realname, constantPrefix}

    @template '_package.json', 'package.json', context
    @template '_travis.yml', '.travis.yml', context
    @template '_README.md', 'README.md', context
    @template '_LICENSE', 'LICENSE', context
    @template '_command.js', 'command.js', context
    @template '_helpers.js', 'helpers.js', context

  install: =>
    return if @skipInstall
    @installDependencies npm: true, bower: false

  end: =>
    return if @skipInstall

module.exports = OctobluSentinelGenerator
