import React, { useState, useEffect, useRef } from "react";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { DashcardService } from "../service/DashcardService";

import moment from "moment";
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
                <span className="p-column-title">Date reception</span>

                {moment(rowData.date_reception).format("YYYY/MM/DD")}
            </>
        );
    };


    const daBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Date affectation</span>
                {moment(rowData.date_affectation).format("YYYY/MM/DD") || <i className="pi pi-spin pi-spinner" style={{ fontSize: "2em" }}></i>}
            </>
        );
    };
    const dtBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Date traitement</span>
                {moment(rowData.date_traitement).format("YYYY/MM/DD") || <i className="pi pi-spin pi-spinner" style={{ fontSize: "2em" }}></i>}
            </>
        );
    };
    const reponseBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Réponse</span>
                {rowData.reponse || <i className="pi pi-spin pi-spinner" style={{ fontSize: "2em" }}></i>}
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
            {localStorage.getItem("role") == "cd" ? (
                <div className="grid">
                     <div className="col-12 lg:col-6 xl:col-4">
                        <Link to="/agence">
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
                    </div>
                    <div className="col-12 lg:col-6 xl:col-4">
                            <Link to="/agence">
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

                    {/* tableau */}
                        <div className="col-12 xl:col-6">
                        <div className="card"  >
                            <h5>Réclamations Récentes</h5>
                            <Chart type="line" data={products.lineReclamations} options={lineOptions} />
                            <br />
                            <DataTable value={products.reclamations||[]} rows={5} paginator responsiveLayout="scroll">
                                <Column field="date_reception" header="Date reception" body={dateBodyTemplate} sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="type" header="Type" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="traitement" header="Canal de Traitement" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="communication" header="Canal de Communication" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                            </DataTable>
                        </div>
                    </div>
                    <div className="col-12 xl:col-6">
                        <div className="card"  >
                            <h5>Traitements Récents</h5>
                            <Chart type="line" data={products.lineTraitements} options={lineOptions} /> <br />
                            <DataTable value={products.traitements||[]} rows={5} paginator responsiveLayout="scroll">
                                <Column field="type" header="Type Réclamation" sortable headerStyle={{ width: "14%", minWidth: "8rem" }}></Column>
                                <Column field="sous_type" header="Sous type" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="traitement" header="Canal de Traitement" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="etat" header="etat" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                            </DataTable>
                        </div>
                    </div>
                    <div className="col-12 xl:col-6">
                            <div className="card">
                                <h5>Cloturation Récentes</h5>
                                <Chart type="line" data={products.lineCloturations} options={lineOptions} /> <br />
                                <DataTable value={products.cloturations||[]} rows={5} paginator responsiveLayout="scroll">
                                    <Column field="type" header="Type Réclamation" sortable headerStyle={{ width: "14%", minWidth: "8rem" }}></Column>
                                    <Column field="sous_type" header="Sous type" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="traitement" header="Canal de Traitement" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column field="etat" header="etat" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                </DataTable>
                            </div>
                        </div>
                </div>
            ) : (
               
                <div className="grid">
                    <div className="col-12 lg:col-6 xl:col-4">
                    
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
                    </div>

                    <div className="col-12 lg:col-6 xl:col-4">
                            <Link to="/traiter">
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
                        </div>


                    {/* tableau */}

                    <div className="col-12 xl:col-6">
                        <div className="card" >
                            <h5>Réclamations Récentes</h5>
                            <Chart type="line" data={products.lineReclamations} options={lineOptions} />
                            <br />
                            <DataTable value={products.reclamations||[]} rows={5} paginator responsiveLayout="scroll">
                            <Column field="date_affectation" header="Date d'affectation" body={daBodyTemplate}  sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                    <Column field="date_traitement" header="Date de traitement" body={dtBodyTemplate} sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                    <Column field="reponse" header="Réponse" body={reponseBodyTemplate} sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                            </DataTable>
                        </div> 
                    </div>
                    <div className="col-12 xl:col-6">
                            <div className="card">
                                <h5>traitement Récentes</h5>
                                <Chart type="line" data={products.lineTraitements} options={lineOptions} /> <br />
                                <DataTable value={products.traitements||[]} rows={5} paginator responsiveLayout="scroll">
                                <Column field="reclamation_id.user_id.displayName" header="Utilisateur" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                                    <Column field="reclamation_id.type" header="Type de réclamation"  sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                    <Column field="date_affectation" header="Date d'affectation" body={daBodyTemplate} sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                    <Column field="reclamation_id.etat" header="Etat" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                </DataTable>
                            </div>
                        </div>
          
                </div>
            )}
        </>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname && prevProps.colorMode === nextProps.colorMode;
};

export default React.memo(Dashboard, comparisonFn);
