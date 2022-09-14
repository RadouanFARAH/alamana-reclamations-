import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ReclamationService } from "../service/ReclamationService";
import { UtilisateurService } from "../service/UtilisateurService";
import { TraitementService } from "../service/TraitementService";
import { Dropdown } from "primereact/dropdown";
import moment from "moment";

const Crud = () => {
    let emptyProduct = {
        id: "",
        type: "",
        communication: "",
        traitement: "",
        date_reception: "",
    };

    const [products, setProducts] = useState(null);
    const [users, setUsers] = useState(null);
    const [userSelected, setUserSelected] = useState(null);

    const [productDialog, setProductDialog] = useState(false);
    const [productDialog2, setProductDialog2] = useState(false);

    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const reclamationService = new ReclamationService();
        reclamationService.getReclamations().then((data) => {
            const result = data.message?.filter((rec) => rec.etat == "Non affecter");
// console.log(data.message)
            setProducts(result);
        });
    }, []);

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setUserSelected(null);
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDetailProductDialog = () => {
        setSubmitted(false);
        setProductDialog2(false);
    };
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (userSelected) {
            let _products = [...products];
            let _product = { ...product };

            const traitementService = new TraitementService();
            traitementService.affecter({ reclamation_id: product, user_id: userSelected }).then((data) => {
                toast.current.show({ severity: "success", summary: "succès ", detail: "Réclamation affecter", life: 3000 });
                const reclamationService = new ReclamationService();
                reclamationService.getReclamations().then((data) => {
                    const result = data.message?.filter((rec) => rec.etat == "Non affecter");

                    setProducts(result);
                });
            });

            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product) => {
        const utilisateurService = new UtilisateurService();
        utilisateurService.getUtilisateur().then((data) => {
            if (localStorage.getItem("role") == "gr") {
                console.log(data.message.filter((ut) => ut?.role == "ec"));
                setUsers(data.message.filter((ut) => ut?.role == "ec"));
            } else if (localStorage.getItem("role") == "ac" || localStorage.getItem("role") == "cc") {
                setUsers(data.message.filter((ut) => ut?.role == "ca" || ut?.role == "ds" || ut?.role == "gr" || ut?.role == "dr" || ut?.role == "gs"));
            } else if (localStorage.getItem("role") == "ca" || localStorage.getItem("role") == "gs") {
                setUsers(data.message.filter((ut) => ut?.role == "ds" || ut?.role == "dr" || ut?.role == "gr"));
            } else {
                setUsers([]);
            }

            console.log(data.message);
        });
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: "success", summary: "Successful", detail: "Product Deleted", life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = "";
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };
    const exportExcel = () => {
        import("xlsx").then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(products);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
            const excelBuffer = xlsx.write(workbook, { bookType: "xlsx", type: "array" });
            saveAsExcelFile(excelBuffer, "products");
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import("file-saver").then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
                let EXCEL_EXTENSION = ".xlsx";
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE,
                });

                module.default.saveAs(data, "export_" + moment(new Date()).format("DD-MM-YYYY") + EXCEL_EXTENSION);
            }
        });
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const detailProduct = (product) => {
        setProduct({ ...product });
        setProductDialog2(true);
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: "success", summary: "Successful", detail: "Products Deleted", life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _product = { ...product };
        _product["category"] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
                </div>
            </React.Fragment>
        );
    };

    const actionBodyTemplate2 = (rowData) => {
        return  <Button icon="pi pi-eye" className="p-button-rounded p-button-danger mr-2" onClick={() => detailProduct(rowData)} />;
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Exporter" type="button" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-help " data-pr-tooltip="XLS" />
                {/* <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} /> */}
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id < 10 && "000" + rowData.id}
                {rowData.id >= 10 && rowData.id < 100 && "00" + rowData.id}
                {rowData.id >= 100 && rowData.id < 1000 && "0" + rowData.id}
                {rowData.id >= 1000 && rowData.id}
            </>
        );
    };

    const dateBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Date reception</span>

                {moment(rowData.date_reception).format("YYYY/MM/DD")}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`assets/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData) => {
        // return (
        //     <>
        //         <span className="p-column-title">Price</span>
        //         {formatCurrency(rowData.price)}
        //     </>
        // );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const ratingBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readonly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button label="Affecter" icon="pi pi-check" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestion des réclamations à affecter</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Recherche..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="non" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="oui" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4"  right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Affichage {first} pour {last} de {totalRecords} affectations"
                        globalFilter={globalFilter}
                        emptyMessage="Aucun affectations trouvé."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column body={actionBodyTemplate2}></Column>
                        <Column field="id" header="Id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="cin" header="Cin" sortable headerStyle={{ width: "14%", minWidth: "8rem" }}></Column>
                        <Column field="type" header="Type Réclamation" sortable headerStyle={{ width: "14%", minWidth: "8rem" }}></Column>
                        <Column field="communication" header="Canal de Comunication" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="traitement" header="Canal de Traitement" sortable headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="date_reception" header="Date reception" sortable body={dateBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: "450px" }} header="Affectation des réclamations" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="formgrid grid">
                            <div className="field col">
                                <Dropdown
                                    value={userSelected}
                                    options={users}
                                    onChange={(e) => {
                                        setUserSelected(e.value);
                                    }}
                                    optionLabel="displayName"
                                    filter
                                    showClear
                                    filterBy="displayName"
                                    placeholder="Affecter à l'utilisateur..."
                                    
                                />
                            </div>
                        </div>
                        {userSelected && (
                            <div className="formgrid grid">
                                <div className="field col">Son role :{(userSelected.role==="gr"&&"Gestionnaire de réclamation")||(userSelected.role==="ca"&&"Chef d'agence")||(userSelected.role==="gs"&&"Gestionnaire")|| (userSelected.role==="dr"&&"Directeur régionale")||(userSelected.role==="ds"&&"Directeur succursale")|| (userSelected.role==="ec"&&"Entité conpétente")} </div>
                            </div>
                        )}
                    </Dialog>


                    <Dialog visible={productDialog2} style={{ width: "900px" }} modal className="p-fluid"  onHide={hideDetailProductDialog}>
                    <h5><b style={{color:"black"}}>Détails Réclamation :</b>   </h5> 
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="id"   ><b>Id :</b>  </label>
                                <p> {product.id < 10 && "000" + product.id}
                                {product.id < 100 && product.id >= 10 && "00" + product.id}
                                {product.id < 1000 && product.id >= 100 && "0" + product.id}
                                {product.id >= 1000 && product.id}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="calification"   ><b>Calification :</b> </label>
                                <p>{(product.calification)}</p>
                            </div>
                        </div>
       
                        <div className="formgrid grid">
                        <div className="field col" >
                                <label htmlFor="reception"   ><b>Date reception</b> :</label>
                                <div>{moment(product?.date_reception).format("YYYY/MM/DD")}</div>
                            </div>
                            <div className="field col">
                                <label htmlFor="etat"   ><b>Etat :</b></label>
                                <p>{(product.etat)}</p>
                            </div>
                        </div>        
                        <div className="formgrid grid">
                        <div className="field col" >
                                <label htmlFor="traitement"   ><b>Canal de traitement :</b></label>
                                <p>{(product.traitement)}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="communication"   ><b>Canal de communication :</b></label>
                                <p>{(product.communication)}</p>
                            </div>
                        </div> 
 

                        <div className="formgrid grid">
                        <div className="field col">
                                <label htmlFor="type"   ><b>Type de réclamation :</b></label>
                                <p>{(product.type)}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="sous-type"   ><b>Sous type :</b></label>
                                <p>{(product.sous_type)}</p>
                            </div>

                        </div>  
                        <div className="formgrid grid">
                        <div className="field col">
                                <label htmlFor="description"   ><b>Description :</b></label>
                                <p>{(product.description)}</p>
                            </div>
                        </div>  
<hr></hr>
                     <h5><b style={{color:"black"}}>Détails Client : </b>{(product.client)}</h5>
                          <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="nom"   ><b>Nom :</b>  </label>
                                <p>{(product.nom)}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="prenom"   ><b>Prénom :</b> </label>
                                <p>{(product.prenom)}</p>
                            </div>
                        </div>
                          <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="cin"   ><b>Cin :</b>  </label>
                                <p>{(product.cin)}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="tiers"   ><b>N°tiers :</b> </label>
                                <p>{(product.tiers)}</p>
                            </div>
                        </div>
                          <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="adress"   ><b>Adresse :</b>  </label>
                                <p>{(product.nom)}</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="telephone"><b>Téléphone :</b> </label>
                                <p>{(product.telephone)}</p>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Crud, comparisonFn);
