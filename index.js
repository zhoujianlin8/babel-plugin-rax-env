const util = require('util');
module.exports = function (t,options) {
    var types = t.types || {};
    const platformMap = {
        weex: 'isWeex',
        web: 'isWeb',
        node: 'isNode',
        reactnative: 'isReactNative'
    };
    function objectExpressionMethod(platformName) {
        const properties = [];
        Object.keys(platformMap).forEach((p) => {
            properties.push(
                types.objectProperty(
                    types.Identifier(platformMap[p]),
                    types.booleanLiteral(p === platformName)
                )
            );
        });
        return types.objectExpression(properties);
    }

    return {
        visitor: {
            CallExpression(path,options) {
                const { node } = path;
                options = util._extend({
                    name: 'universal-env',
                },options.opts || {});
                if (
                    options.platform  &&
                    node.callee.name === 'require' &&
                    node.arguments[0] &&
                    node.arguments[0].value === options.name
                ) {
                    //替换
                    path.replaceWith(objectExpressionMethod(options.platform));
                }
            }

        }
    };
}
