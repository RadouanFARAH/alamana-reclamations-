import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { Route, useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import { AppTopbar } from "./AppTopbar";
import { AppFooter } from "./AppFooter";
import { AppMenu } from "./AppMenu";
import { AppConfig } from "./AppConfig";

import Dashboard from "./components/Dashboard";
import ButtonDemo from "./components/ButtonDemo";
import ChartDemo from "./components/ChartDemo";
import Documentation from "./components/Documentation";
import FileDemo from "./components/FileDemo";
import FloatLabelDemo from "./components/FloatLabelDemo";
import FormLayoutDemo from "./components/FormLayoutDemo";
import InputDemo from "./components/InputDemo";
import ListDemo from "./components/ListDemo";
import MenuDemo from "./components/MenuDemo";
import MessagesDemo from "./components/MessagesDemo";
import MiscDemo from "./components/MiscDemo";
import OverlayDemo from "./components/OverlayDemo";
import MediaDemo from "./components/MediaDemo";
import PanelDemo from "./components/PanelDemo";
import TableDemo from "./components/TableDemo";
import TreeDemo from "./components/TreeDemo";
import InvalidStateDemo from "./components/InvalidStateDemo";
import BlocksDemo from "./components/BlocksDemo";
import IconsDemo from "./components/IconsDemo";

import Crud from "./pages/Crud";
import EmptyPage from "./pages/EmptyPage";
import TimelineDemo from "./pages/TimelineDemo";

import PrimeReact from "primereact/api";
import { Tooltip } from "primereact/tooltip";

import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-coy.css";
import "./assets/demo/flags/flags.css";
import "./assets/demo/Demos.scss";
import "./assets/layout/layout.scss";
import "./App.scss";
import Reclamation from "./pages/Reclamation";
import TraiterRec from "./pages/TraiterRec";
import CloturerRec from "./pages/CloturerRec";
import AffecterRec from "./pages/AffecterRec";
import RecAgence from "./pages/RecAgence";
import RecSiege from "./pages/RecSiege";
import EtatRec from "./pages/EtatRec";
import Login from "./pages/Login";
import User from "./pages/User";
import Agence from "./pages/Agence";
import CaTraiter from "./pages/CaTraiter";
import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from "primereact/api";
import Siege from "./pages/Siege";
import Dashboard2 from "./components/Dashboard2";
import JoursFeries from "./pages/JoursFeries";

const App = () => {
    const [layoutMode, setLayoutMode] = useState("static");
    const [layoutColorMode, setLayoutColorMode] = useState("light");
    const [inputStyle, setInputStyle] = useState("outlined");
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();
    const [user, setUser] = useState("");
    const [role, setRole] = useState(localStorage.getItem("role") || "");

    PrimeReact.ripple = true;

    addLocale("fr", {
        emptyFilterMessage: "Aucune option disponible",
        emptyMessage: "Aucun résultat trouvé",
    });

    locale("fr");

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        setUser(localStorage.getItem("token"));
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    };

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    };

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode);
    };

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode);
    };

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    };

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === "overlay") {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            } else if (layoutMode === "static") {
                setStaticMenuInactive((prevState) => !prevState);
            }
        } else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    };

    const onSidebarClick = () => {
        menuClick = true;
    };

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    };

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    };

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    };
    const isDesktop = () => {
        return window.innerWidth >= 992;
    };
    let menu = [];
    if (role === "gr") {
        menu = [
            {
                label: "Accueil",
                items: [
                    {
                        label: "Tableau de bord",
                        icon: "pi pi-fw pi-home",
                        to: "/",
                    },
                ],
            },

            {
                label: "Action",
                icon: "pi pi-fw pi-clone",
                items: [
                    //{ label: "Agences", icon: "pi pi-fw pi-map-marker", to: "/agences" },
                    //{ label: "Utilisateurs", icon: "pi pi-fw pi-users", to: "/utilisateurs" },
                    { label: "Réclamations", icon: "pi pi-fw pi-file", to: "/reclamations" },
                    { label: "Affecter Réclamations", icon: "pi pi-fw pi-user-edit", to: "/affecter" },
                    { label: 'Réclamations à traiter', icon: 'pi pi-fw pi-check', to: '/traiter' },
                    { label: 'Réclamations à cloturer', icon:"pi pi-spin pi-spinner", to: '/cloturer' },
                    { label: "Réclamations ", icon: "pi pi-fw pi-table", to: "/agence" },
                    // { label: 'Réclamations Siege', icon: 'pi pi-fw pi-table', to: '/siege' },
                    //{ label: "État des Réclamations", icon: "pi pi-fw pi-clock", to: "/etat" },

                ],
            },
        ];
    }
    if (role === "gs") {
        menu = [
            {
                label: "Accueil",
                items: [
                    {
                        label: "Tableau de bord",
                        icon: "pi pi-fw pi-home",
                        to: "/",
                    },
                ],
            },

            {
                label: "Action",
                icon: "pi pi-fw pi-clone",
                items: [
                    //{ label: "Agences", icon: "pi pi-fw pi-map-marker", to: "/agences" },
                    //{ label: "Utilisateurs", icon: "pi pi-fw pi-users", to: "/utilisateurs" },
                    //{ label: "Réclamations", icon: "pi pi-fw pi-file", to: "/reclamations" },
                    // { label: "Traiter Réclamations", icon: "pi pi-fw pi-user-edit", to: "/traiter" },
                    { label: 'Réclamations à traiter ', icon: 'pi pi-fw pi-check', to: '/traiter' },
                    //{ label: 'Réclamations à cloturer', icon:"pi pi-spin pi-spinner", to: '/cloturer' },
                    { label: "Réclamations Agence", icon: "pi pi-fw pi-table", to: "/agence" },
                    // { label: 'Réclamations Siege', icon: 'pi pi-fw pi-table', to: '/siege' },
                    //{ label: "État des Réclamations", icon: "pi pi-fw pi-clock", to: "/etat" },

                ],
            },
        ];
    }
    if (role === "admin") {
        menu = [
            {
                label: "Accueil",
                items: [
                    {
                        label: "Tableau de bord",
                        icon: "pi pi-fw pi-home",
                        to: "/",
                    },
                ],
            },

            {
                label: "Action",
                icon: "pi pi-fw pi-clone",
                items: [
                    { label: "Agences", icon: "pi pi-fw pi-map-marker", to: "/agences" },
                    // { label: 'Siege', icon: 'pi pi-fw pi-table', to: '/siege' },
                    { label: "Utilisateurs", icon: "pi pi-fw pi-users", to: "/utilisateurs" },
                    { label: "Jours féries", icon: "pi pi-fw pi-calendar", to: "/JoursFeries" },
                    // { label: "Réclamations", icon: "pi pi-fw pi-file", to: "/reclamations" },
                    // { label: "Affecter Réclamations", icon: "pi pi-fw pi-user-edit", to: "/affecter" },
                    // { label: 'Réclamations à traiter', icon: 'pi pi-fw pi-check', to: '/traiter' },
                    // { label: 'Réclamations à cloturer', icon:"pi pi-spin pi-spinner", to: '/cloturer' },
                    // { label: "Réclamations Agence", icon: "pi pi-fw pi-table", to: "/agence" },
                    
                    //{ label: "État des Réclamations", icon: "pi pi-fw pi-clock", to: "/etat" },

                ],
            },
        ];
    }
    if (role === "dr") {
        menu = [
            {
                label: "Accueil",
                items: [
                    {
                        label: "Tableau de bord",
                        icon: "pi pi-fw pi-home",
                        to: "/",
                    },
                ],
            },

            {
                label: "Action",
                icon: "pi pi-fw pi-clone",
                items: [
                    // { label: "Agences", icon: "pi pi-fw pi-map-marker", to: "/agences" },
                    // { label: "Utilisateurs", icon: "pi pi-fw pi-users", to: "/utilisateurs" },
                    // { label: "Réclamations", icon: "pi pi-fw pi-file", to: "/reclamations" },
                    // { label: "Affecter Réclamations", icon: "pi pi-fw pi-user-edit", to: "/affecter" },
                    { label: 'Réclamations à traiter', icon: 'pi pi-fw pi-check', to: '/traiter' },
                    // { label: 'Réclamations à cloturer', icon:"pi pi-spin pi-spinner", to: '/cloturer' },
                    { label: "Réclamations Agence", icon: "pi pi-fw pi-table", to: "/agence" },
                    // { label: 'Réclamations Siege', icon: 'pi pi-fw pi-table', to: '/siege' },
                    //{ label: "État des Réclamations", icon: "pi pi-fw pi-clock", to: "/etat" },

                ],
            },
        ];
    }
    if (role === "ec") {
        menu = [
            {
                label: "Accueil",
                items: [
                    {
                        label: "Tableau de bord",
                        icon: "pi pi-fw pi-home",
                        to: "/",
                    },
                ],
            },

            {
                label: "Action",
                icon: "pi pi-fw pi-clone",
                items: [
                    // { label: "Agences", icon: "pi pi-fw pi-map-marker", to: "/agences" },
                    // { label: "Utilisateurs", icon: "pi pi-fw pi-users", to: "/utilisateurs" },
                    // { label: "Réclamations", icon: "pi pi-fw pi-file", to: "/reclamations" },
                    // { label: "Affecter Réclamations", icon: "pi pi-fw pi-user-edit", to: "/affecter" },
                    { label: 'Réclamations à traiter', icon: 'pi pi-fw pi-check', to: '/traiter' },
                    // { label: 'Réclamations à cloturer', icon:"pi pi-spin pi-spinner", to: '/cloturer' },
                    // { label: "Réclamations Agence", icon: "pi pi-fw pi-table", to: "/agence" },
                    // { label: 'Réclamations Siege', icon: 'pi pi-fw pi-table', to: '/siege' },
                    //{ label: "État des Réclamations", icon: "pi pi-fw pi-clock", to: "/etat" },

                ],
            },
        ];
    }
    if (role === "cd") {
        menu = [
            {
                label: "Accueil",
                items: [
                    {
                        label: "Tableau de bord",
                        icon: "pi pi-fw pi-home",
                        to: "/",
                    },
                ],
            },

            {
                label: "Action",
                icon: "pi pi-fw pi-clone",
                items: [
                    // { label: 'Utilisateurs', icon: 'pi pi-fw pi-users', to: '/utilisateurs' },
                    // { label: 'Réclamations', icon: 'pi pi-fw pi-file', to: '/reclamations' },
                    // { label: 'Affecter Réclamations', icon: 'pi pi-fw pi-user-edit', to: '/affecter' },
                    // { label: 'État des Réclamations', icon: 'pi pi-fw pi-clock', to: '/etat' },
                    // { label: "Réclamations Siege", icon: "pi pi-fw pi-table", to: "/siege" },
                    // { label: "Réclamations à traiter", icon: "pi pi-fw pi-check", to: "/traiter" },
                    // { label: "Réclamations à cloturer", icon: "pi pi-spin pi-spinner", to: "/cloturer" },
                    { label: 'Réclamations', icon: 'pi pi-fw pi-table', to: '/agence' },
                ],
            },
        ];
    }
    if (role === "ca") {
        menu = [
            {
                label: "Accueil",
                items: [
                    {
                        label: "Tableau de bord",
                        icon: "pi pi-fw pi-home",
                        to: "/",
                    },
                ],
            },

            {
                label: "Action",
                icon: "pi pi-fw pi-clone",
                items: [
                    // { label: 'Utilisateurs', icon: 'pi pi-fw pi-users', to: '/utilisateurs' },
                    // { label: 'Réclamations', icon: 'pi pi-fw pi-file', to: '/reclamations' },
                    // { label: 'Affecter Réclamations', icon: 'pi pi-fw pi-user-edit', to: '/affecter' },
                    // { label: "Réclamations Siege", icon: "pi pi-fw pi-table", to: "/siege" },
                    { label: "Réclamations à traiter", icon: "pi pi-fw pi-check", to: "/traiter" },
                    // { label: "Réclamations à cloturer", icon: "pi pi-spin pi-spinner", to: "/cloturer" },
                    { label: 'Réclamations Agence', icon: 'pi pi-fw pi-table', to: '/agence' },
                    // { label: 'État des Réclamations', icon: 'pi pi-fw pi-clock', to: '/etat' },
                ],
            },
        ];
    }
    if (role === "cc") {
        menu = [
            {
                label: "Accueil",
                items: [
                    {
                        label: "Tableau de bord",
                        icon: "pi pi-fw pi-home",
                        to: "/",
                    },
                ],
            },

            {
                label: "Action",
                icon: "pi pi-fw pi-clone",
                items: [
                    // { label: 'Utilisateurs', icon: 'pi pi-fw pi-users', to: '/utilisateurs' },
                    { label: "Réclamations", icon: "pi pi-fw pi-file", to: "/reclamations" },
                    { label: "Affecter Réclamations", icon: "pi pi-fw pi-user-edit", to: "/affecter" },
                    // { label: 'Réclamations Agence', icon: 'pi pi-fw pi-table', to: '/agence' },
                    // { label: "État des Réclamations", icon: "pi pi-fw pi-clock", to: "/etat" },
                    //  { label: 'Réclamations à traiter', icon: 'pi pi-fw pi-check', to: '/traiter' },
                    //  { label: 'Réclamations à cloturer', icon:"pi pi-spin pi-spinner", to: '/cloturer' },
                    // { label: 'Réclamations Siege', icon: 'pi pi-fw pi-table', to: '/siege' },
                ],
            },
        ];
    }
    if (role === "ac") {
        menu = [
            {
                label: "Accueil",
                items: [
                    {
                        label: "Tableau de bord",
                        icon: "pi pi-fw pi-home",
                        to: "/",
                    },
                ],
            },

            {
                label: "Action",
                icon: "pi pi-fw pi-clone",
                items: [
                    // { label: 'Utilisateurs', icon: 'pi pi-fw pi-users', to: '/utilisateurs' },
                    { label: "Réclamations", icon: "pi pi-fw pi-file", to: "/reclamations" },
                    { label: "Affecter Réclamations", icon: "pi pi-fw pi-user-edit", to: "/affecter" },
                    // { label: 'Réclamations Agence', icon: 'pi pi-fw pi-table', to: '/agence' },
                    //{ label: "État des Réclamations", icon: "pi pi-fw pi-clock", to: "/etat" },
                    //  { label: 'Réclamations à traiter', icon: 'pi pi-fw pi-check', to: '/traiter' },
                    //  { label: 'Réclamations à cloturer', icon:"pi pi-spin pi-spinner", to: '/cloturer' },
                    // { label: 'Réclamations Siege', icon: 'pi pi-fw pi-table', to: '/siege' },
                ],
            },
        ];
    }

    if (role === "ds") {
        menu = [
            {
                label: "Accueil",
                items: [
                    {
                        label: "Tableau de bord",
                        icon: "pi pi-fw pi-home",
                        to: "/",
                    },
                ],
            },

            {
                label: "Action",
                icon: "pi pi-fw pi-clone",
                items: [
                    // { label: 'Utilisateurs', icon: 'pi pi-fw pi-users', to: '/utilisateurs' },
                    // { label: 'Réclamations', icon: 'pi pi-fw pi-file', to: '/reclamations' },
                    { label: "Réclamations à traiter", icon: "pi pi-fw pi-check", to: "/traiter" },
                    // { label: "Réclamations à cloturer", icon: "pi pi-spin pi-spinner", to: "/cloturer" },
                    // { label: 'Affecter Réclamations', icon: 'pi pi-fw pi-user-edit', to: '/affecter' },
                    { label: 'Réclamations Agence', icon: 'pi pi-fw pi-table', to: '/agence' },
                    // { label: 'État des Réclamations', icon: 'pi pi-fw pi-clock', to: '/etat' },
                    // { label: 'Réclamations Siege', icon: 'pi pi-fw pi-table', to: '/siege' },
                ],
            },
        ];
    }
 

    const addClass = (element, className) => {
        if (element.classList) element.classList.add(className);
        else element.className += " " + className;
    };

    const removeClass = (element, className) => {
        if (element.classList) element.classList.remove(className);
        else element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };

    const wrapperClass = classNames("layout-wrapper", {
        "layout-overlay": layoutMode === "overlay",
        "layout-static": layoutMode === "static",
        "layout-static-sidebar-inactive": staticMenuInactive && layoutMode === "static",
        "layout-overlay-sidebar-active": overlayMenuActive && layoutMode === "overlay",
        "layout-mobile-sidebar-active": mobileMenuActive,
        "p-input-filled": inputStyle === "filled",
        "p-ripple-disabled": ripple === false,
        "layout-theme-light": layoutColorMode === "light",
    });

    if (!user) {
        return <Route path="/" exact render={() => <Login></Login>} />;
    } else {
        return (
            <div className={wrapperClass} onClick={onWrapperClick}>
                {/* <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" /> */}

                <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode} mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />

                <div className="layout-sidebar" onClick={onSidebarClick}>
                    <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
                </div>

                <div className="layout-main-container">
                    {role === "gr" && (
                        <div className="layout-main">
                            <Route path="/" exact render={() => <Dashboard colorMode={layoutColorMode} location={location} />} />
                            {/* <Route path="/agences" component={Agence} />
                            <Route path="/utilisateurs" component={User} /> */}
                            <Route path="/reclamations" component={Reclamation} />
                            <Route path="/affecter" component={AffecterRec} />
                            
                            <Route path="/agence" component={RecAgence} />

                            <Route path="/traiter" component={TraiterRec} />
                            <Route path="/cloturer" component={CloturerRec} />
                            {/* <Route path="/siege" component={RecSiege} /> */}
                        </div>
                    )}
                    {role === "gs" && (
                        <div className="layout-main">
                            <Route path="/" exact render={() => <Dashboard2 colorMode={layoutColorMode} location={location} />} />
                            <Route path="/traiter" component={CaTraiter} />
                            {/* <Route path="/agences" component={Agence} />
                            <Route path="/utilisateurs" component={User} /> */}
                            {/* <Route path="/reclamations" component={Reclamation} /> */}
                            {/* <Route path="/traiter" component={CaTraiter} /> */}
                            
                            <Route path="/agence" component={RecAgence} />

                            {/* <Route path="/cloturer" component={CloturerRec} /> */}
                            {/* <Route path="/siege" component={RecSiege} /> */}
                        </div>
                    )}
                    {role === "admin" && (
                        <div className="layout-main">
                            <Route path="/" exact render={() => <Dashboard colorMode={layoutColorMode} location={location} />} />
                            <Route path="/agences" component={Agence} />
                            {/* <Route path="/siege" component={Siege} /> */}
                            <Route path="/utilisateurs" component={User} />
                            <Route path="/JoursFeries" component={JoursFeries} />
                            {/* <Route path="/affecter" component={AffecterRec} /> */}
                            
                            {/* <Route path="/agence" component={RecAgence} /> */}

                            {/* <Route path="/traiter" component={TraiterRec} /> */}
                            {/* <Route path="/cloturer" component={CloturerRec} /> */}
                            {/* <Route path="/siege" component={RecSiege} /> */}
                        </div>
                    )}
                    {role === "dr" && (
                        <div className="layout-main">
                            <Route path="/" exact render={() => <Dashboard2 colorMode={layoutColorMode} location={location} />} />
                            {/* <Route path="/agences" component={Agence} />
                            <Route path="/utilisateurs" component={User} /> */}
                            {/* <Route path="/reclamations" component={Reclamation} /> */}
                            {/* <Route path="/affecter" component={AffecterRec} /> */}
                            
                            <Route path="/agence" component={RecAgence} />

                            <Route path="/traiter" component={TraiterRec} />
                            {/* <Route path="/cloturer" component={CloturerRec} /> */}
                            {/* <Route path="/siege" component={RecSiege} /> */}
                        </div>
                    )}
                    {role === "cd" && (
                        <div className="layout-main">
                            <Route path="/" exact render={() => <Dashboard2 colorMode={layoutColorMode} location={location} />} />
                            {/* <Route path="/traiter" component={TraiterRec} />
                            <Route path="/cloturer" component={CloturerRec} /> */}
                            <Route path="/agence" component={RecAgence} />
                            {/* 
                        <Route path="/utilisateurs" component={User} />
                        <Route path="/siege" component={RecSiege} />
                        <Route path="/reclamations" component={Reclamation} />
                        <Route path="/affecter" component={AffecterRec} />
                    */}
                        </div>
                    )}
                    {role === "ec" && (
                        <div className="layout-main">
                            <Route path="/" exact render={() => <Dashboard2 colorMode={layoutColorMode} location={location} />} />
                            <Route path="/traiter" component={TraiterRec} />
                            {/* <Route path="/cloturer" component={CloturerRec} />
                            <Route path="/agence" component={RecAgence} /> */}
                            {/* 
                        <Route path="/utilisateurs" component={User} />
                        <Route path="/siege" component={RecSiege} />
                        <Route path="/reclamations" component={Reclamation} />
                        <Route path="/affecter" component={AffecterRec} />
                    */}
                        </div>
                    )}
 
                    {role === "ca" && (
                        <div className="layout-main">
                            <Route path="/" exact render={() => <Dashboard2 colorMode={layoutColorMode} location={location} />} />
                            <Route path="/traiter" component={CaTraiter} />
                            <Route path="/agence" component={RecAgence} /> 

                            {/* <Route path="/cloturer" component={CloturerRec} /> */}
                            {/* 
                        <Route path="/utilisateurs" component={User} />
                        <Route path="/reclamations" component={Reclamation} />
                        <Route path="/affecter" component={AffecterRec} />
                        <Route path="/siege" component={RecSiege} />
                    */}
                        </div>
                    )}
                    {role === "cc" && (
                        <div className="layout-main">
                            <Route path="/" exact render={() => <Dashboard colorMode={layoutColorMode} location={location} />} />

                            <Route path="/reclamations" component={Reclamation} />
                            <Route path="/affecter" component={AffecterRec} />

                            {/* <Route path="/traiter" component={TraiterRec} />
                        <Route path="/cloturer" component={CloturerRec} />
                        <Route path="/siege" component={RecSiege} />
                        <Route path="/utilisateurs" component={User} />
                        <Route path="/agence" component={RecAgence} /> 
                    */}
                        </div>
                    )}
                    {role === "ac" && (
                        <div className="layout-main">
                            <Route path="/" exact render={() => <Dashboard colorMode={layoutColorMode} location={location} />} />

                            <Route path="/reclamations" component={Reclamation} />
                            <Route path="/affecter" component={AffecterRec} />

                            {/* <Route path="/traiter" component={TraiterRec} />
                        <Route path="/cloturer" component={CloturerRec} />
                        <Route path="/siege" component={RecSiege} />
                        <Route path="/agence" component={RecAgence} />
                        <Route path="/utilisateurs" component={User} /> 
                    */}
                        </div>
                    )}
                    {role === "ds" && (
                        <div className="layout-main">
                            <Route path="/" exact render={() => <Dashboard2 colorMode={layoutColorMode} location={location} />} />
                            <Route path="/traiter" component={TraiterRec} />
                            <Route path="/agence" component={RecAgence} /> 

                            {/* 
                            <Route path="/cloturer" component={CloturerRec} />
                    <Route path="/siege" component={RecSiege} />
                    <Route path="/utilisateurs" component={User} />
                    <Route path="/reclamations" component={Reclamation} />
                    <Route path="/affecter" component={AffecterRec} />
                    */}
                        </div>
                    )}

                    <AppFooter layoutColorMode={layoutColorMode} />
                </div>

                <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange} layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

                <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                    <div className="layout-mask p-component-overlay"></div>
                </CSSTransition>
            </div>
        );
    }
};

export default App;
