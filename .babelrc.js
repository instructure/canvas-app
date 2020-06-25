const isTest = String(process.env.NODE_ENV) === "test";

module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: ["macros"],
};
