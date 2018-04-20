module.exports = () => {
  const plugins = [];

  plugins.push(
    require('@babel/plugin-proposal-pipeline-operator'),
    require('@babel/plugin-proposal-optional-chaining'),
    require('@babel/plugin-proposal-nullish-coalescing-operator'),
  );

  return {
    plugins,
  };
};
