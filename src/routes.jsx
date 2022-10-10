import {Routes, Route} from 'react-router-dom';

import Main from './pages/Main'
import Repositorio from './pages/Repositorio'


export default function RoutesApp(){

    return(
        <Routes>
            <Route exact path='/' element={
                <Main/>
            }/>
            <Route exact path='/repositorio/:repositorio' element={
                <Repositorio/>
            }/>
        </Routes>
    )

}