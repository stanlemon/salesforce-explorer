import React from 'react';
import { HashRouter as ReactRouter, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
import GlobalNavigation from './lds/GlobalNavigation';
import ObjectList from './ObjectList';
import ObjectView from './ObjectView';
import RecordList from './RecordList';
import RecordView from './RecordView';
import SoqlView from './SoqlView';
import PushTopicList from './PushTopicList';
import PushTopicView from './PushTopicView';

const routes = [
    {
        path: '/',
        component: ObjectList,
    },
    {
        path: '/objects/:name',
        component: ObjectView,
    },
    {
        path: '/records/:name',
        component: RecordList,
    },
    {
        path: '/records/:name/:id',
        component: RecordView,
    },
    {
        path: '/soql',
        component: SoqlView,
    },
    {
        path: '/push',
        component: PushTopicList,
    },
    {
        path: '/push/:id',
        component: PushTopicView,
    },
];

// This should be the same history that our router uses, we're pulling it here to easily pass down to components
const history = createHashHistory();

export default function App({ conn, logout }) {
    const contentCss = {
        position: 'fixed',
        width: '100%',
        height: '100%',
        overflow: 'scroll',
    };

    return (
        <ReactRouter>
            <div>
                <div className="menubar">
                    <GlobalNavigation
                        appName="Explorer"
                        menu={[
                            {
                                label: 'Objects',
                                link: '/',
                                handler: () => {},
                            },
                            {
                                label: 'SOQL',
                                link: '/soql',
                                handler: () => {},
                            },
                            {
                                label: 'Push Topics',
                                link: '/push',
                                handler: () => {},
                            },
                            {
                                label: 'Logout',
                                link: '',
                                handler: () => logout(),
                            },
                        ]}
                    />
                </div>

                <div style={contentCss}>
                    {routes.map(route => {
                        const Component = route.component;

                        return (
                            <Route
                                exact
                                strict
                                path={route.path}
                                // Use the function's name for our key
                                key={Component.name}
                                render={({ match }) => (
                                    <Component
                                        conn={conn}
                                        route={match}
                                        history={history}
                                    />
                                )}
                            />
                        );
                    })}
                </div>
            </div>
        </ReactRouter>
    );
}
