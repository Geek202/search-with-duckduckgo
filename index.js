const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule } = require('powercord/webpack');
const { ContextMenu } = require('powercord/components');

module.exports = class SearchWithDuckDuckGo extends Plugin {
    async startPlugin() {

        const injectInto = await getModule(
            m => m.default && m.default.displayName === 'MessageContextMenu'
        );

        inject('search-with-ddg-menu', injectInto, 'default', (event, res) => {
            const target = event[0].target;

            if (target.tagName.toLowerCase() !== 'img' && window.getSelection().toString().length > 0) {
                res.props.children.push(
                    ...ContextMenu.renderRawItems([
                        {
                            type: 'button',
                            name: 'Search with DuckDuckGo',
                            id: 'searchWithDuckDuckGo',
                            onClick: () => {
                                window.open("https://duckduckgo.com/?q=" + encodeURIComponent(window.getSelection().toString()), "_blank");
                            }
                        }
                    ])
                );
            }

            return res;
        });
    }

    pluginWillUnload() {
        uninject('search-with-ddg-menu');
    }
};
