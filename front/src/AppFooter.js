import React from 'react';

export const AppFooter = (props) => {

    return (
        <div className="layout-footer">
            <img src={props.layoutColorMode === 'light' ? 'assets/layout/images/logo-dark-img.png' : 'assets/layout/images/logo-white-img.png'} alt="Logo" height="20" className="mr-2" />
            par
            <span className="font-medium ml-2">Alamana</span>
        </div>
    );
}
