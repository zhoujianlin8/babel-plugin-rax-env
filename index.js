const types = require('babel-types');
const util = require('util');
module.exports = function (t,options) {
    t = t.types || {};
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
            },
            /*ImportDeclaration(path,options) {
                const { node } = path;
                options = util._extend({
                    name: 'universal-env',
                },options.opts || {});
                console.log(22)
               /!* if (node.source.value === options.name) {
                    node.specifiers.forEach(spec => {
                        specified.push({
                        local: spec.local.name,
                        imported: spec.imported.name
                    });
                });

                    if (options.platform) {
                        specified.forEach(specObj => {
                            let newNodeInit = specObj.imported === platformMap[options.platform] ?
                                true : false;
                        let newNode = variableDeclarationMethod(
                            specObj.imported,
                            newNodeInit
                        );

                        path.insertAfter(newNode);

                        // Support custom alise import:
                        // import { isWeex as iw } from 'universal-env';
                        // const isWeex = true;
                        // const iw = true;
                        if (specObj.imported !== specObj.local) {
                            newNode = variableDeclarationMethod(
                                specObj.local,
                                newNodeInit
                            );
                            path.insertAfter(newNode);
                        }
                    });

                        path.remove();
                    }
                }*!/
            }*/
        }
    };
}
