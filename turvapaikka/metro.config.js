const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// Lisää .gif-tiedostot assetExts -listaan
config.resolver.assetExts.push(
  'gif'
)

module.exports = config