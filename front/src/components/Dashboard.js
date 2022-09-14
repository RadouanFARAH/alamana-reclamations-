import React, { useState, useEffect, useRef } from "react";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import moment from "moment";

import { DashcardService } from "../service/DashcardService";

import { Link } from "react-router-dom";



const Dashboard = (props) => {
    
 //dashboard
    const [products, setProducts] = useState({});

 

    const menu1 = useRef(null);
    const menu2 = useRef(null);
    const [lineOptions, setLineOptions] = useState(null);
 
    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: "#495057",
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: "#495057",
                    },
                    grid: {
                        color: "#ebedef",
                    },
                },
                y: {
                    ticks: {
                        color: "#495057",
                    },
                    grid: {
                        color: "#ebedef",
                    },
                },
            },
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: "#ebedef",
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: "#ebedef",
                    },
                    grid: {
                        color: "rgba(160, 167, 181, .3)",
                    },
                },
                y: {
                    ticks: {
                        color: "#ebedef",
                    },
                    grid: {
                        color: "rgba(160, 167, 181, .3)",
                    },
                },
            },
        };

        setLineOptions(lineOptions);
    };

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Date d'inscription</span>

                {moment(rowData.date_inscription).format("YYYY/MM/DD")}
            </>
        );
    };
    const dateaffBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Date d'affectation</span>

                {moment(rowData.date_affectation).format("YYYY/MM/DD")}
            </>
        );
    };

    const datetrBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Date traitement</span>

                {moment(rowData.date_traitement).format("YYYY/MM/DD")}
            </>
        );
    };

    useEffect(() => {

//dashboard
    const recService = new DashcardService();
    recService.getDatas().then((data) => {
         console.log(data);
        setProducts(data);
    });
    }, []);

    useEffect(() => {
        if (props.colorMode === "light") {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [props.colorMode]);


    return (
        <>
            {localStorage.getItem("role") == "admin" ? (
                <div className="grid">
                    <div className="col-12 lg:col-6 xl:col-4">
                        <Link to="/agences">
                            <div className="card mb-0">
                                <div className="flex justify-content-between mb-3">
                                    <div>
                                        <span className="block text-500 font-medium mb-3">Agences</span>
                                        <div className="text-900 font-medium text-xl">{products.agenceTotal||0}</div>
                                    </div>
                                    <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                        <i className="pi pi-building text-blue-500 text-xl" />
                                    </div>
                                </div>
                                <span className="text-green-500 font-medium">{products.agenceMois||0} nouveaux </span>
                                <span className="text-500">ce mois dernier</span>
                            </div>
                        </Link>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-4">
                        <Link to="/siege">
                            <div className="card mb-0">
                                <div className="flex justify-content-between mb-3">
                                    <div>
                                        <span className="block text-500 font-medium mb-3">Jours féries</span>
                                        <div className="text-900 font-medium text-xl">{products.siegeTotal||0}</div>
                                    </div>
                                    <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                        <i className="pi pi-th-large text-orange-500 text-xl" />
                                    </div>
                                </div>
                                <span className="text-green-500 font-medium">{products.siegeMois||0} nouvelles </span>
                                <span className="text-500">ce mois dernier</span>
                            </div>
                        </Link>
                    </div>
                    <div className="col-12 lg:col-6 xl:col-4">
                        <Link to="/utilisateurs">
                            <div className="card mb-0">
                                <div className="flex justify-content-between mb-3">
                                    <div>
                                        <span className="block text-500 font-medium mb-3">Utilisateurs</span>
                                        <div className="text-900 font-medium text-xl">{products.userTotal||0}</div>
                                    </div>
                                    <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                        <i className="pi pi-users text-green-500 text-xl" />
                                    </div>
                                </div>
                                <span className="text-green-500 font-medium">{products.userMois||0} nouveaux </span>
                                <span className="text-500">ce mois dernier</span>
                            </div>
                        </Link>
                    </div>

                    {/* tableau */}
 
                    <div className="col-12 xl:col-6">
                        <div className="card"  >
                            <h5>Agences Récentes</h5>
                            <Chart type="line" data={products.lineAgence} options={lineOptions} />
                            <br />
                            <DataTable value={products.agences||[]} rows={5} paginator responsiveLayout="scroll">
                                <Column field="id" header="Id" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="code_agence" header="Code d'agence" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                            </DataTable>
                        </div>
                    </div>
                    <div className="col-12 xl:col-6">
                        <div className="card"  > 
                            <h5>Jours féries Récents</h5>
                            <Chart type="line" data={products.lineSiege} options={lineOptions} /> <br />
                            <DataTable value={products.sieges||[]} rows={5} paginator responsiveLayout="scroll">
                                <Column field="id" header="Id" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="jour_ferie" header="Jours fériés" sortable headerStyle={{ width: "14%", minWidth: "8rem" }}></Column>
                            </DataTable>
                        </div>
                    </div>
                    <div className="col-12 xl:col-65">
                        <div className="card">
                            <h5>Utilisateurs Récentes</h5>
                            <Chart type="line" data={products.lineUtilisateur} options={lineOptions} /> <br />
                            <DataTable value={products.users||[]} rows={5} paginator responsiveLayout="scroll">
                                <Column field="displayName" header="Nom complet" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="role" header="Role" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="date_inscription" header="date d'inscription" body={dateBodyTemplate}  sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="agence" header="agence ou siege" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid">
               
                    <div className="col-12 lg:col-6 xl:col-4">
                        <Link to="/reclamations">
                            <div className="card mb-0">
                                <div className="flex justify-content-between mb-3">
                                    <div>
                                        <span className="block text-500 font-medium mb-3">Réclamations</span>
                                        <div className="text-900 font-medium text-xl">{products.reclamationTotal||0}</div>
                                    </div>
                                    <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                        <i className="pi pi-file text-blue-500 text-xl" />
                                    </div>
                                </div>
                                <span className="text-green-500 font-medium">{products.reclamationMois||0} nouveaux </span>
                                <span className="text-500">ce mois dernier</span>
                            </div>
                        </Link>
                    </div>
                  
                    {localStorage.getItem("role") !== "cc" &&
                    localStorage.getItem("role") !== "ac" && (
                    <div className="col-12 lg:col-6 xl:col-4">
                        <Link to="/agence">
                            <div className="card mb-0">
                                <div className="flex justify-content-between mb-3">
                                    <div>
                                        <span className="block text-500 font-medium mb-3">Traitement</span>
                                         <div className="text-900 font-medium text-xl">{products.traitementTotal||0}</div>
                                    </div>
                                    <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                        <i className="pi pi-clock text-orange-500 text-xl" />
                                    </div>
                                </div>
                                <span className="text-green-500 font-medium">{products.traitementMois||0} nouvelles </span>
                                <span className="text-500">ce mois dernier</span>
                             </div>
                        </Link>
                    </div>)}
  
                  

                    {localStorage.getItem("role") == "gr" && (
                        <div className="col-12 lg:col-6 xl:col-4">
                            <Link to="/cloturer">
                                <div className="card mb-0">
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Cloturation</span>
                                            <div className="text-900 font-medium text-xl">{products.cloturationTotal||0}</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                                            <i className="pi pi-check text-cyan-500 text-xl" />
                                        </div>
                                    </div>

                                    <span className="text-green-500 font-medium">{products.cloturationMois||0} nouveaux </span>
                                    <span className="text-500">ce mois dernier</span>
                                </div>
                            </Link>
                        </div>
                    )}
                    {/* tableau */}

                    <div className="col-12 xl:col-14"> 
                        <div className="card"  >
                            <h5>Réclamations Récentes</h5>
                            <Chart type="line" data={products.lineReclamations} options={lineOptions} />
                            <br />
                            <DataTable value={products.reclamations||[]} rows={5} paginator responsiveLayout="scroll">
                            <Column field="calification" header="Calification" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="type" header="Type" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="traitement" header="Canal de Traitement" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="communication" header="Canal de Communication" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                            </DataTable>
                        </div>
                    </div>

                    {localStorage.getItem("role") !== "cc" && localStorage.getItem("role") !== "ac" && (
                    <div className="col-12 xl:col-6">
                        <div className="card"  >
                            <h5>Traitements Récents</h5>
                            <Chart type="line" data={products.lineTraitements} options={lineOptions} /> <br />
                            <DataTable value={products.traitements||[]} rows={5} paginator responsiveLayout="scroll">
                                <Column field="reclamation_id.type" header="Type Réclamation" sortable headerStyle={{ width: "14%", minWidth: "8rem" }}></Column>
                                <Column field="reclamation_id.traitement" header="Canal de Traitement" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="reclamation_id.communication" header="Canal de Communication" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="date_affectation" header="Date affectation" body={dateaffBodyTemplate} sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                            </DataTable>
                        </div>
                    </div>)}

                    {localStorage.getItem("role") == "gr" && (
                        <div className="col-12 xl:col-6">
                            <div className="card">
                                <h5>Cloturation Récentes</h5>
                                <Chart type="line" data={products.lineCloturations} options={lineOptions} /> <br />
                                <DataTable value={products.cloturations||[]} rows={5} paginator responsiveLayout="scroll">
                                <Column field="calification" header="Calification" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="type" header="Type" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="traitement" header="Canal de Traitement" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="communication" header="Canal de Communication" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                </DataTable>
                            </div>
                        </div>
                    )}


                </div>
            )}
        </>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname && prevProps.colorMode === nextProps.colorMode;
};

export default React.memo(Dashboard, comparisonFn);
