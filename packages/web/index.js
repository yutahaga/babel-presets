const path = require('path');

module.exports = (context, options = {}) => {
  const presets = [];
  const plugins = [];

  // JSX
  if (options.jsx !== false) {
    plugins.push(
      require('@babel/plugin-syntax-jsx'),
      require('babel-plugin-transform-vue-jsx'),
    );
  }

  // Flow
  if (options.flow) {
    presets.push([require('@babel/preset-flow')]);
  }

  const envOptions = {
    modules: options.modules || false,
    targets: options.targets,
    useBuiltIns: typeof options.useBuiltIns === 'undefined' ? 'usage' : options.useBuiltIns,
  };

  // target running node version (this is set by unit testing plugins)
  if (process.env.NODE_ENV === 'test' && !options.test) {
    envOptions.targets = { node: 'current' };
    envOptions.modules = 'commonjs';
    // necessary for dynamic import to work in tests
    plugins.push(require('babel-plugin-dynamic-import-node'));
  }

  // pass options along to babel-preset-env
  presets.push([require('@babel/preset-env'), envOptions]);

  // stage 2. This includes some important transforms, e.g. dynamic import
  // and rest object spread.
  presets.push([require('@babel/preset-stage-2'), {
    useBuiltIns: true,
  }]);

  // transform runtime, but only for helpers
  plugins.push([require('@babel/plugin-transform-runtime'), {
    polyfill: false,
    regenerator: false,
    moduleName: path.dirname(require.resolve('@babel/runtime/package.json')),
  }]);

  return {
    presets,
    plugins,
  };
};
