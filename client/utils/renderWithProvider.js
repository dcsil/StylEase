import React from "react";
import { render } from '@testing-library/react-native';
import { configureStore } from "@reduxjs/toolkit";
import { Provider} from "react-redux";
import UserReducer from '../stores/UserStore';

export function RenderWithProviders(
    ui,
    { initialState = {}, 
    store = configureStore({ 
        reducer: { UserReducer }, 
        initialState}),
        ...renderOptions
    } = {}
    ) {
    function Wrapper({ children }) {
        return <Provider store={store}>{children}</Provider>;
    }
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions })};
   
}
