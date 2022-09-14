import React, { useState }  from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

export const AppTopbar = (props) => {

    const [displayName, setDisplayName] = useState(localStorage.getItem("displayName")||"")

    const logout=()=>{
        localStorage.removeItem("token")
        localStorage.removeItem("sAMAccountName")
        localStorage.removeItem("displayName")
        localStorage.removeItem("role")
        window.location.href="/"
    } 

    return (
        <div className="layout-topbar" style={{height:"80px"}}>
            <Link to="/" className="layout-topbar-logo d-flex justify-content-center text-center">
                <img width={"60px"} src={props.layoutColorMode === 'light' ? 'assets/layout/images/logo-dark-img.png' : 'assets/layout/images/logo-white-img.png'} alt="logo"/>
                <img src={props.layoutColorMode === 'light' ? 'assets/layout/images/logo-dark-text.png' : 'assets/layout/images/logo-white-text.png'} alt="logo"/>
                
            </Link>

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars"/>
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

                <ul className={classNames("layout-topbar-menu lg:flex origin-top", {'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                    {/* <li>
                        <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                            <i className="pi pi-calendar"/>
                            <span>Events</span>
                        </button>
                    </li>
                    <li>
                        <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                            <i className="pi pi-cog"/>
                            <span>Settings</span>
                        </button>
                    </li> */}
                    <li>
                    <h5 style={{marginTop:"10px",marginLeft:"20px"}}>{displayName}</h5>
                    </li>
                    <li>
                                
                        <button onClick={logout} className="p-link layout-topbar-button" >
                            <i className="pi pi-sign-out"/>
                            <span>Déconnecter</span>
                        </button>
                    </li>
                </ul>
        </div>
    );
}
