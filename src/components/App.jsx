import React from 'react';
import { HashRouter as ReactRouter, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
import GlobalNavigation from './lds/GlobalNavigation';
import Home from './Home';
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
        component: Home,
    },
    {
        path: '/objects',
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

const history = createHashHistory();

export default function App({ conn }) {
    console.log(history.location);
    return (
        <ReactRouter history={history}>
            <div>
                <div className="titlebar" style={{ WebkitAppRegion: 'drag' }} />

                <div className="menubar">
                    <GlobalNavigation
                        appName="Explorer"
                        menu={[
                            {
                                label: 'Home',
                                link: '/',
                                handler: () => {},
                            },
                            {
                                label: 'Object',
                                link: '/objects',
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
                                handler: () => this.logout(),
                            },
                        ]}
                    />
                </div>

                <div className="content">
                    {routes.map(route => {
                        const Component = route.component;

                        return (
                            <Route
                                exact
                                strict
                                path={route.path}
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
