import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from 'primereact/calendar';

import moment from "moment";

import { FeriesService } from "../service/FeriesService";

const JoursFeries = () => {
    let emptyProduct = {
        id: "",
        jour_ferie: "",
        date_debut:"",
        date_fin:""
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const feriesService = new FeriesService();
        feriesService.getJoursFeries().then((data) => {
            console.log(data.message)
            setProducts(data.message);
        });
    }, []);

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

            let _products = [...products];
            let _product = { ...product };
            if (product.id) {

                const feriesService = new FeriesService();
                //product:front end(input) data backend
                feriesService.putJoursFeries(product).then((data) => {
                    console.log(product)
                    if (data.error) {
                        toast.current.show({ severity: "error", summary: "Erreur", detail: "Jour férie non modifier", life: 3000 });
                    } else {
                        toast.current.show({ severity: "success", summary: "Succès", detail: "Jour férie modifier", life: 3000 });

                        feriesService.getJoursFeries().then((data) => {
                            setProducts(data.message);
                        });
                    }
                });
            } else {
                const feriesService = new FeriesService();
                //product:front end(input) data backend
                feriesService.postJoursFeries(product).then((data) => {
                    console.log(product)
                    if (data.error) {
                        toast.current.show({ severity: "error", summary: "Erreur", detail: "Jour férie non ajouter", life: 3000 });
                    } else {
                        toast.current.show({ severity: "success", summary: "Succès", detail: "Jour férie  ajouter", life: 3000 });

                        feriesService.getJoursFeries().then((data) => {
                            setProducts(data.message);
                        });
                    }
                });
            }

            setProductDialog(false);
            setProduct(emptyProduct);

    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        const feriesService = new FeriesService();
        //product:front end(input) data backend
        feriesService.deleteJoursFeries(product).then((data) => {
            console.log(product)
            if (data.error) {
                toast.current.show({ severity: "error", summary: "Erreur", detail: "Jour férie non supprimer", life: 3000 });
            } else {
                toast.current.show({ severity: "success", summary: "Succès", detail: "Jour férie supprimer", life: 3000 });

                feriesService.getJoursFeries().then((data) => {
                    setProducts(data.message);
                });
            }
        });
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
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

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: "success", summary: "Successful", detail: "Products Deleted", life: 3000 });
    };


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
            let _product = { ...product };
            _product[`${name}`] = val;

            setProduct(_product);

    };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Ajouter" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
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
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
        );
    };

    const datedBodyTemplate = (rowData) => {
            return <div>{moment(rowData?.date_debut).format("YYYY/MM/DD")}</div>;
    };
    const datefBodyTemplate = (rowData) => {
        return <div>{moment(rowData?.date_fin).format("YYYY/MM/DD")}</div>;

    };


    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestion Des Jours féries</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Rechercher..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Enregistrer" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="Non" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Oui" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt} value={products} dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" currentPageReportTemplate="Affichage {first} à {last} de {totalRecords} jours" globalFilter={globalFilter} emptyMessage="aucune jour férie trouvée." header={header} responsiveLayout="scroll"  >
                        <Column field="id" header="Id" sortable headerStyle={{ width: "42%", minWidth: "20rem" }}></Column>
                        <Column field="jour_ferie" header="Jours féries" sortable  headerStyle={{ width: "42%", minWidth: "20rem" }}></Column>
                        <Column field="date_debut" header=" Date début" body={datedBodyTemplate} headerStyle={{ width: "42%", minWidth: "20rem" }}></Column>
                        <Column field="date_fin" header="Date fin" body={datefBodyTemplate} headerStyle={{ width: "42%", minWidth: "20rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: "450px" }} header="Jours féries Détails" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field col">
                            <label htmlFor="jour_ferie">Jour férie</label>
                            <InputText id="jour_ferie" value={product.jour_ferie} onChange={(e) => onInputChange(e, "jour_ferie")} required autoFocus className={classNames({ "p-invalid": submitted && !product.jour_ferie })} />
                            {submitted && !product.jour_ferie && <small className="p-invalid">Jour férie est obligatoire.</small>}
                        </div>
                        <div className="field col">
                        <label htmlFor="date_debut">Date début</label>
                        <Calendar id="date_debut" value={new Date(product.date_debut)} onChange={(e) => onInputChange(e, "date_debut")} required  className={classNames({ "p-invalid": submitted && !product.date_debut })} dateFormat="yy-mm-dd"/>
                        {submitted && !product.date_debut && <small className="p-invalid">Date début est obligatoire.</small>}
                    </div>

                        <div className="field col">
                            <label htmlFor="date_fin">Date fin</label>
                            <Calendar id="date_fin" value={new Date(product.date_fin)} onChange={(e) => onInputChange(e, "date_fin")} required  className={classNames({ "p-invalid": submitted && !product.date_fin })} dateFormat="yy-mm-dd"/>
                            {submitted && !product.date_fin && <small className="p-invalid">Date fin est obligatoire.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirmation" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {product && (
                                <span>
                                    Êtes-vous sûr que vous voulez supprimer <b>{product.jour_ferie}</b>?
                                </span>
                            )}
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

export default React.memo(JoursFeries, comparisonFn);
