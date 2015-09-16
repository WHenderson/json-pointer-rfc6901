assert = require('chai').assert
fs = require('fs')
path = require('path')

walk = (dir) ->
  names = fs.readdirSync(dir).sort()

  filenames = []
  dirnames = []

  for name in names
    stat = fs.statSync(path.join(dir, name))
    if stat.isDirectory()
      dirnames.push(name)
    else if stat.isFile()
      extname = path.extname(name)
      if extname == '.js' or extname == '.coffee'
        filenames.push(name)

  for name in filenames
    do (name) ->
      test(name, () ->
        require(path.join(dir, name))
      )

  for name in dirnames
    do (name) ->
      suite(name, () ->
        walk(path.join(dir, name))
      )

suite('examples', () ->
  walk(path.join(__dirname, '../examples'))
)
