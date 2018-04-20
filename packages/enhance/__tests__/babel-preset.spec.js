const babel = require('@babel/core');
const preset = require('../index');

const defaultOptions = {
  babelrc: false,
  presets: [preset],
};

test('pipeline operator', () => {
  const { code } = babel.transformSync(`
    function doubleSay (str) {
      return str + ", " + str;
    }
    function capitalize (str) {
      return str[0].toUpperCase() + str.substring(1);
    }
    function exclaim (str) {
      return str + '!';
    }
    "hello"
      |> doubleSay
      |> capitalize
      |> exclaim;
  `.trim(), defaultOptions);
  expect(eval(code)).toBe('Hello, hello!');
});

test('nullish coalescing operator', () => {
  let result = babel.transformSync(`
    var object = {};
    var foo = object.foo ?? "default";
    foo;
  `.trim(), defaultOptions);
  expect(eval(result.code)).toBe('default');

  result = babel.transformSync(`
    var object = { foo: "bar" };
    var foo = object.foo ?? "default";
    foo;
  `.trim(), defaultOptions);
  expect(eval(result.code)).toBe('bar');
});

test('optional chaining', () => {
  let result = babel.transformSync(`
    const obj = {
      foo: {
        bar: {
          baz: 42,
        },
      },
    };
    obj?.foo?.bar?.baz;
  `.trim(), defaultOptions);
  expect(eval(result.code)).toBe(42);

  result = babel.transformSync(`
    const obj = {
      foo: {
        bar: {
          baz: 42,
        },
      },
    };
    obj?.qux?.baz;
  `.trim(), defaultOptions);
  expect(eval(result.code)).toBeUndefined();
});
