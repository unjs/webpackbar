function loader(source) {
  return `/* Length: ${source.length} */\n ${source}`;
}

module.exports = loader;
