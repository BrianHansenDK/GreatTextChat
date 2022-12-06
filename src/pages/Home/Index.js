import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router'
import { Col, Grid, Row } from 'rsuite'
import Sidebar from '../../components/Sidebar'
import { RoomsProvider } from '../../context/rooms.context'
import { useMediaQuery } from '../../misc/CustomHooks'
import Chat from './Chat'

const Home = () => {
    const isDecktop = useMediaQuery('(min-width: 992px)')
    const { isExact } = useRouteMatch()

    const renderSidebar = isDecktop || isExact
    return (
        <RoomsProvider>

            <Grid className='h-100 w-100'>
                <Row className='h-100'>
                    {
                        renderSidebar ? (
                            <Col xs={24} md={8} className='h-100'>
                                <Sidebar />
                            </Col>
                        ) : null
                    }

                    <Switch>
                        <Route exact path='/chat/:chatId'>
                            <Col xs={24} md={16} className='h-100' >
                                <Chat />
                            </Col>
                        </Route>
                        <Route>
                            {
                                isDecktop ? (
                                    <Col xs={24} md={16} className='h-100' >
                                        <h6 className='text-center mt-page'>
                                            Select a chat
                                        </h6>
                                    </Col>
                                ) : null
                            }
                        </Route>
                    </Switch>
                </Row>
            </Grid>
        </RoomsProvider>
    )
}

export default Home