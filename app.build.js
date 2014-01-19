({
  appDir: "app",
  dir: "dist",
  baseUrl: ".",
  optimize: "none",

  mainConfigFile: 'app/js/requirejs-config.js',
  modules: [
    {
      name: "js/main",
    }
  ]
})