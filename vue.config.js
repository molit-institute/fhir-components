const dependencies = Object.keys(require("./package.json").dependencies);

const config = {
  lintOnSave: true,
  configureWebpack: {}
};

if (process.env.NODE_ENV === "production" && process.env.E2E !== "cypress") {
  config.configureWebpack.externals = dependencies;
}

module.exports = config;
